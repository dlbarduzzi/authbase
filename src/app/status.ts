const _statusCode = [200, 201, 400, 401, 404, 422, 500] as const

const _statusText = [
  "Ok",
  "Created",
  "Bad Request",
  "Unauthorized",
  "Not Found",
  "Unprocessable Entity",
  "Server Error",
] as const

const _statusName = [
  "ok",
  "created",
  "badRequest",
  "unauthorized",
  "notFound",
  "unprocessableEntity",
  "serverError",
] as const

type StatusName = (typeof _statusName)[number]
type StatusCode = (typeof _statusCode)[number]
type StatusText = (typeof _statusText)[number]

export const status: Record<StatusName, { code: StatusCode; text: StatusText }> = {
  ok: {
    code: 200,
    text: "Ok",
  },
  created: {
    code: 201,
    text: "Created",
  },
  badRequest: {
    code: 400,
    text: "Bad Request",
  },
  unauthorized: {
    code: 401,
    text: "Unauthorized",
  },
  notFound: {
    code: 404,
    text: "Not Found",
  },
  unprocessableEntity: {
    code: 422,
    text: "Unprocessable Entity",
  },
  serverError: {
    code: 500,
    text: "Server Error",
  },
}
