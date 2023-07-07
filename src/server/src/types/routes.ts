import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod
} from 'fastify'

export type TypedRouter = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>

export type RouteHandler<Schema extends FastifySchema = FastifySchema> =
  RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGenericInterface,
    ContextConfigDefault,
    Schema,
    TypeBoxTypeProvider,
    FastifyBaseLogger
  >
