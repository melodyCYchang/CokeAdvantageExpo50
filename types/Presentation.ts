// To parse this data:
//
//   import { Convert, Presentation } from "./file";
//
//   const presentation = Convert.toPresentation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Presentation {
  ID: number;
  post_author: string;
  post_date: Date;
  post_date_gmt: Date;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: Date;
  post_modified_gmt: Date;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
  presentation_type: string;
  subtype: string;
  link_type: string;
  title: string;
  formatted_date: string;
  url: string;
  mime_type: string;
  filename: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toPresentation(json: string): Presentation {
    return cast(JSON.parse(json), r('Presentation'));
  }

  public static presentationToJson(value: Presentation): string {
    return JSON.stringify(uncast(value, r('Presentation')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
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

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
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
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
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
  Presentation: o(
    [
      { json: 'ID', js: 'ID', typ: 0 },
      { json: 'post_author', js: 'post_author', typ: '' },
      { json: 'post_date', js: 'post_date', typ: Date },
      { json: 'post_date_gmt', js: 'post_date_gmt', typ: Date },
      { json: 'post_content', js: 'post_content', typ: '' },
      { json: 'post_title', js: 'post_title', typ: '' },
      { json: 'post_excerpt', js: 'post_excerpt', typ: '' },
      { json: 'post_status', js: 'post_status', typ: '' },
      { json: 'comment_status', js: 'comment_status', typ: '' },
      { json: 'ping_status', js: 'ping_status', typ: '' },
      { json: 'post_password', js: 'post_password', typ: '' },
      { json: 'post_name', js: 'post_name', typ: '' },
      { json: 'to_ping', js: 'to_ping', typ: '' },
      { json: 'pinged', js: 'pinged', typ: '' },
      { json: 'post_modified', js: 'post_modified', typ: Date },
      { json: 'post_modified_gmt', js: 'post_modified_gmt', typ: Date },
      { json: 'post_content_filtered', js: 'post_content_filtered', typ: '' },
      { json: 'post_parent', js: 'post_parent', typ: 0 },
      { json: 'guid', js: 'guid', typ: '' },
      { json: 'menu_order', js: 'menu_order', typ: 0 },
      { json: 'post_type', js: 'post_type', typ: '' },
      { json: 'post_mime_type', js: 'post_mime_type', typ: '' },
      { json: 'comment_count', js: 'comment_count', typ: '' },
      { json: 'filter', js: 'filter', typ: '' },
      { json: 'presentation_type', js: 'presentation_type', typ: '' },
      { json: 'subtype', js: 'subtype', typ: '' },
      { json: 'link_type', js: 'link_type', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'formatted_date', js: 'formatted_date', typ: '' },
      { json: 'url', js: 'url', typ: '' },
      { json: 'mime_type', js: 'mime_type', typ: '' },
      { json: 'filename', js: 'filename', typ: '' },
    ],
    false
  ),
};
