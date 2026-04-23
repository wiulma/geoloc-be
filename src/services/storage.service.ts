import { Injectable } from '@nestjs/common';
import * as fsync from 'node:fs';
import path from 'node:path';

@Injectable()
export class StorageService {
  private FILE_PATH = path.join(__dirname, '..', 'user-data.json');
  read(): User[] {
    try {
      if (!fsync.existsSync(this.FILE_PATH)) return [];
      const data = fsync.readFileSync(this.FILE_PATH, 'utf-8');
      return JSON.parse(data ?? []) as User[];
    } catch (exc) {
      console.log('read storage error', (exc as Error).message);
      return [];
    }
  }

  write(data: User[]): void {
    try {
      fsync.writeFileSync(this.FILE_PATH, JSON.stringify(data, null, 2));
    } catch (exc) {
      console.log('Error writing storage', (exc as Error).message);
    }
  }
  add(user: User): User {
    const data = this.read();
    data.push(user);
    this.write(data);
    return user;
  }

  update(user: User): User {
    const data = this.read();
    const idx = data.findIndex((elm) => (elm.userId = user.userId));
    const elm = { ...data[idx], ...user };
    data.splice(idx, 1, elm);
    this.write(data);
    return elm;
  }

  getById(userId: number): User | undefined {
    const data = this.read();
    return data.find((elm) => elm.userId === userId);
  }
}
