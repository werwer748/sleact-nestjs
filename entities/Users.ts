import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChannelChats } from "./ChannelChats";
import { ChannelMembers } from "./ChannelMembers";
import { Dms } from "./Dms";
import { Mentions } from "./Mentions";
import { Workspacemembers } from "./Workspacemembers";
import { Workspaces } from "./Workspaces";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "sleact" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 30 })
  email: string;

  @Column("varchar", { name: "nickname", length: 30 })
  nickname: string;

  @Column("varchar", { name: "password", length: 100 })
  password: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  updatedAt: Date;

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => ChannelChats, (channelChats) => channelChats.user)
  channelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.user)
  channelMembers: ChannelMembers[];

  @OneToMany(() => Dms, (dms) => dms.sender)
  dms: Dms[];

  @OneToMany(() => Dms, (dms) => dms.receiver)
  dms2: Dms[];

  @OneToMany(() => Mentions, (mentions) => mentions.sender)
  mentions: Mentions[];

  @OneToMany(() => Mentions, (mentions) => mentions.receiver)
  mentions2: Mentions[];

  @OneToMany(
    () => Workspacemembers,
    (workspacemembers) => workspacemembers.user
  )
  workspacemembers: Workspacemembers[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.owner)
  workspaces: Workspaces[];
}
