import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { EventService } from "./event.service";
import { CreateEventInput } from "./event.input";
import { Event } from "./event.entity";
import { AuthorizedContext, Context } from "../../context.type";

@Resolver()
export class EventResolver {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  @Query(() => [Event])
  async events() {
    return this.eventService.getEvents();
  }

  @Authorized()
  @Mutation(() => Event)
  async maintainEvent(@Arg("id") id: number, @Ctx() ctx: AuthorizedContext) {
    return this.eventService.maintainEvent(id, ctx.user);
  }

  @Authorized()
  @Mutation(() => Event)
  async editableEvent(@Arg("id") id: number, @Ctx() ctx: AuthorizedContext) {
    return this.eventService.editableEvent(id, ctx.user);
  }

  @Authorized()
  @Mutation(() => Event)
  async releaseEvent(@Arg("id") id: number, @Ctx() ctx: AuthorizedContext) {
    return this.eventService.releaseEvent(id, ctx.user);
  }

  @Mutation(() => Event)
  async createEvent(@Arg("data") newEvent: CreateEventInput) {
    return this.eventService.createEvent(newEvent);
  }
}
