export type CookieAttributes = {
  value: string
  path?: string
  domain?: string
  secure?: boolean
  expires?: Date
  "max-age"?: number
  httponly?: boolean
  samesite?: "lax" | "none" | "strict"
  [key: string]: unknown
}

export function parseSetCookieHeader(setCookie: string): Map<string, CookieAttributes> {
  const cookies = new Map<string, CookieAttributes>()
  const cookieArray = setCookie.split(", ")

  cookieArray.forEach(cookieString => {
    const parts = cookieString.split(";").map(part => part.trim())

    const [nameValue, ...attributes] = parts
    if (nameValue == null) {
      return
    }

    const [name, ...valueParts] = nameValue.split("=")
    const value = valueParts.join("=")
    if (!name || value == null) {
      return
    }

    const attributesObject: CookieAttributes = { value }

    attributes.forEach(attr => {
      const [attrName, ...attrValueParts] = attr.split("=")
      if (attrName == null) {
        return
      }

      const attrValue = attrValueParts.join("=")
      const normalizedAttrName = attrName.trim().toLowerCase()

      switch (normalizedAttrName) {
        case "path":
          attributesObject.path = attrValue ? attrValue.trim() : undefined
          break
        case "domain":
          attributesObject.domain = attrValue ? attrValue.trim() : undefined
          break
        case "secure":
          attributesObject.secure = true
          break
        case "expires":
          attributesObject.expires = attrValue ? new Date(attrValue.trim()) : undefined
          break
        case "max-age":
          attributesObject["max-age"] = attrValue
            ? parseInt(attrValue.trim(), 10)
            : undefined
          break
        case "httponly":
          attributesObject.httponly = true
          break
        case "samesite":
          attributesObject.samesite = attrValue
            ? (attrValue.trim().toLowerCase() as "lax" | "none" | "strict")
            : undefined
          break
        default:
          attributesObject[normalizedAttrName] = attrValue ? attrValue.trim() : true
          break
      }
    })

    cookies.set(name, attributesObject)
  })

  return cookies
}

export function setCookieHeader(headers: Headers, response: Response) {
  const setCookie = response.headers.get("set-cookie")
  if (setCookie == null) {
    return
  }

  const cookieMap = new Map<string, string>()

  const existingCookiesHeader = headers.get("cookie") ?? ""
  existingCookiesHeader.split(";").forEach(cookie => {
    const [name, ...rest] = cookie.trim().split("=")
    if (name && rest.length > 0) {
      cookieMap.set(name, rest.join("="))
    }
  })

  const setCookieArray = setCookie.split(",")
  setCookieArray.forEach(cookie => {
    const cookies = parseSetCookieHeader(cookie)
    cookies.forEach((value, name) => {
      cookieMap.set(name, value.value)
    })
  })

  const updatedCookies = Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ")
  headers.set("cookie", updatedCookies)
}

export function createSetCookie(name: string, attributes: CookieAttributes): string {
  if (attributes.value.trim() === "") {
    return "invalid"
  }

  let cookie = `${name}=${attributes.value}`

  Object.entries(attributes).forEach(([name, value]) => {
    switch (name) {
      case "path":
        cookie = `${cookie}; Path=${attributes.path}`
        break
      case "domain":
        cookie = `${cookie}; Domain=${attributes.domain}`
        break
      case "secure":
        if (attributes.secure === true) {
          cookie = `${cookie}; Secure`
        }
        break
      case "expires":
        cookie = `${cookie}; Expires=${attributes.expires}`
        break
      case "max-age":
        cookie = `${cookie}; Max-Age=${attributes["max-age"]}`
        break
      case "httponly":
        if (attributes.httponly === true) {
          cookie = `${cookie}; HttpOnly`
        }
        break
      case "samesite":
        if (attributes.samesite === "lax") {
          cookie = `${cookie}; SameSite=Lax`
          break
        }
        if (attributes.samesite === "none") {
          cookie = `${cookie}; SameSite=None`
          break
        }
        if (attributes.samesite === "strict") {
          cookie = `${cookie}; SameSite=Strict`
          break
        }
        break
      default:
        attributes[name] = value ? (value as string).trim() : true
        break
    }
  })

  return cookie
}
