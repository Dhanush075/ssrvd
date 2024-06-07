import { Controller, Get } from '@nestjs/common';

@Controller("/ping")
export class AppController {
  constructor() { }

  @Get()
  getPong(): string {
    return "pong!!";
  }
}
