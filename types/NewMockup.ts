// To parse this data:
//
//   import { Convert, NewMockup } from "./file";
//
//   const newMockup = Convert.toNewMockup(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface NewMockup {
  created_at: Date;
  id: number;
  image: Image;
  name: string;
  owner: Owner;
  published_at: Date;
  remoteId: null;
  stickerPlacement: string;
  updated_at: Date;
}

export interface Image {
  alternativeText: null;
  caption: null;
  created_at: Date;
  ext: string;
  formats: Formats;
  hash: string;
  height: number;
  id: number;
  mime: string;
  name: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  size: number;
  updated_at: Date;
  url: string;
  width: number;
}

export interface Formats {
  large: ImageFormats;
  medium: ImageFormats;
  small: ImageFormats;
  thumbnail: ImageFormats;
}

export interface ImageFormats {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  name: string;
  path: null;
  size: number;
  url: string;
  width: number;
}

export interface Owner {
  blocked: boolean;
  conaNumber: string;
  confirmed: boolean;
  created_at: Date;
  displayName: string;
  email: string;
  folder: null;
  id: number;
  location: Location;
  position: string;
  provider: string;
  pushTokens: Array<string[]>;
  role: number;
  updated_at: Date;
  userId: string;
  username: string;
}

export interface Location {
  id: number;
  location: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toNewMockup(json: string): NewMockup {
    return cast(JSON.parse(json), r("NewMockup"));
  }

  public static newMockupToJson(value: NewMockup): string {
    return JSON.stringify(uncast(value, r("NewMockup")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  NewMockup: o(
    [
      { json: "created_at", js: "created_at", typ: Date },
      { json: "id", js: "id", typ: 0 },
      { json: "image", js: "image", typ: r("Image") },
      { json: "name", js: "name", typ: "" },
      { json: "owner", js: "owner", typ: r("Owner") },
      { json: "published_at", js: "published_at", typ: Date },
      { json: "remoteId", js: "remoteId", typ: null },
      { json: "stickerPlacement", js: "stickerPlacement", typ: "" },
      { json: "updated_at", js: "updated_at", typ: Date },
    ],
    false,
  ),
  Image: o(
    [
      { json: "alternativeText", js: "alternativeText", typ: null },
      { json: "caption", js: "caption", typ: null },
      { json: "created_at", js: "created_at", typ: Date },
      { json: "ext", js: "ext", typ: "" },
      { json: "formats", js: "formats", typ: r("Formats") },
      { json: "hash", js: "hash", typ: "" },
      { json: "height", js: "height", typ: 0 },
      { json: "id", js: "id", typ: 0 },
      { json: "mime", js: "mime", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "previewUrl", js: "previewUrl", typ: null },
      { json: "provider", js: "provider", typ: "" },
      { json: "provider_metadata", js: "provider_metadata", typ: null },
      { json: "size", js: "size", typ: 3.14 },
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "url", js: "url", typ: "" },
      { json: "width", js: "width", typ: 0 },
    ],
    false,
  ),
  Formats: o(
    [
      { json: "large", js: "large", typ: r("Large") },
      { json: "medium", js: "medium", typ: r("Large") },
      { json: "small", js: "small", typ: r("Large") },
      { json: "thumbnail", js: "thumbnail", typ: r("Large") },
    ],
    false,
  ),
  Large: o(
    [
      { json: "ext", js: "ext", typ: "" },
      { json: "hash", js: "hash", typ: "" },
      { json: "height", js: "height", typ: 0 },
      { json: "mime", js: "mime", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "path", js: "path", typ: null },
      { json: "size", js: "size", typ: 3.14 },
      { json: "url", js: "url", typ: "" },
      { json: "width", js: "width", typ: 0 },
    ],
    false,
  ),
  Owner: o(
    [
      { json: "blocked", js: "blocked", typ: true },
      { json: "conaNumber", js: "conaNumber", typ: "" },
      { json: "confirmed", js: "confirmed", typ: true },
      { json: "created_at", js: "created_at", typ: Date },
      { json: "displayName", js: "displayName", typ: "" },
      { json: "email", js: "email", typ: "" },
      { json: "folder", js: "folder", typ: null },
      { json: "id", js: "id", typ: 0 },
      { json: "location", js: "location", typ: r("Location") },
      { json: "position", js: "position", typ: "" },
      { json: "provider", js: "provider", typ: "" },
      { json: "pushTokens", js: "pushTokens", typ: a(a("")) },
      { json: "role", js: "role", typ: 0 },
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "userId", js: "userId", typ: "" },
      { json: "username", js: "username", typ: "" },
    ],
    false,
  ),
  Location: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "location", js: "location", typ: "" },
    ],
    false,
  ),
};
