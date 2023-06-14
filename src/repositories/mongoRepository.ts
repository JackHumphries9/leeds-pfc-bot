import {Repository, SetAttendanceResponse} from "./repository";
import {IAttendance} from "../types/UtilTypes";
import {AttendanceModel} from "../models/attendance";
import {firstDayOfWeek} from "../utils/temporal";
import mongoose from "mongoose";

export  class MongoRepository extends Repository {
    constructor() {
        super();
        (async () => await mongoose.connect(process.env.MONGO_URL, {dbName: "discord"}))();
    }

    async clearAttendance(): Promise<void> {
        await AttendanceModel.deleteMany().exec()
        return;
    }

    async getAttendanceFromEventId(eventId: string): Promise<IAttendance[]> {
        return await AttendanceModel.find({ eventId: eventId }).exec();
    }

    async getEventAttendanceForUser(
        eventId: string,
        userId: string
    ): Promise<IAttendance | undefined> {
        return (await AttendanceModel.findOne({event: eventId, userId: userId}).exec()) ?? undefined;
    }

    async setAttendance(
        userId: string,
        eventId: string,
        attending: boolean
    ): Promise<SetAttendanceResponse> {
        const att = await AttendanceModel.findOne({event: eventId, userId: userId}).exec()

        if (!att) {
            const newAttendance = new AttendanceModel({
                userId: userId,
                eventId: eventId,
                isAttending: attending,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })

            await newAttendance.save();
            return { updated: false}
        } else {
            await AttendanceModel.findByIdAndUpdate(att._id, {isAttending: attending})
            return { updated: true}
        }
    }

    async getAllAttendance(): Promise<IAttendance[]> {
        return await AttendanceModel.find().exec();
    }

    async clearOldAttendance(): Promise<void> {
        await AttendanceModel.deleteMany({updatedAt: {$lt: firstDayOfWeek(new Date(), 1).getTime()}}).exec()
        return;
    }
}
