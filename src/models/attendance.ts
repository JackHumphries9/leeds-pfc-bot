import mongoose, {Schema} from 'mongoose';
import config from "../config";
import {IAttendance} from "../types/UtilTypes";

const tblName = config.stage && config.stage === "prod"
    ? "attendance"
    : "attendance-dev"

const attendanceSchema = new Schema({
    userId: Schema.Types.String,
    eventId: Schema.Types.String,
    isAttending: Schema.Types.Boolean,
    createdAt: Schema.Types.Number,
    updatedAt: Schema.Types.Number
});

export const AttendanceModel = mongoose.model<IAttendance>(tblName, attendanceSchema)