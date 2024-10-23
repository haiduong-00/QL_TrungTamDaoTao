import { OmitType } from "@nestjs/mapped-types";
import { Subject } from "../entities/subject.entity";

export class CreateSubjectDto extends OmitType(Subject, ["id"]) {}
