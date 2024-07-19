import { Repository } from "typeorm";
import appDataSource from "../../libs/database";
import { CreateEventInput } from "./event.input";
import { Event } from "./event.entity";
import e from "express";
import { User } from "../user/user.entity";

export class EventService {
  private readonly eventRepository: Repository<Event>;

  constructor() {
    this.eventRepository = appDataSource.getRepository(Event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ["vouchers", "editingUser"],
    });
  }

  async createEvent(data: CreateEventInput): Promise<Event> {
    const newEvent = this.eventRepository.create(data);
    return this.eventRepository.save(newEvent);
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ["vouchers"],
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async checkEventVoucherAvailability(eventId: number): Promise<boolean> {
    const event = await this.getEventById(eventId);
    return event.quantity < event.maxQuantity;
  }

  async editableEvent(id: number, user: User): Promise<Event> {
    const event = await this.getEventById(id);

    const isEditingExpired =
      event.editingExpired && event.editingExpired < new Date();
    const isEditingUser = event.editingUser?.id === user.id;

    // If the event is not being edited by anyone, it can be edited
    if (!event.editingUser) return event;

    // If the event is being edited by another user, throw an error
    if (!isEditingUser) {
      throw new Error("Event is being edited by another user");
    }

    // If the event is being edited by the same user and the editing time has expired, throw an error
    if (isEditingExpired) {
      throw new Error("Event is being expired for editing");
    }

    return event;
  }

  async maintainEvent(id: number, user: User): Promise<Event> {
    const event = await this.getEventById(id);

    if (event.editingUser && event.editingUser.id !== user.id) {
      throw new Error("Event is being edited by another user");
    }

    event.editingUser = user;
    event.editingExpired = new Date(new Date().getTime() + 1000 * 60 * 5);

    return this.eventRepository.save(event);
  }

  async releaseEvent(id: number, user: User): Promise<Event> {
    const event = await this.editableEvent(id, user);

    event.editingUser = null as any;
    event.editingExpired = null as any;

    return this.eventRepository.save(event);
  }
}
