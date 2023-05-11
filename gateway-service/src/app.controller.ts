import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("AUTH_SERVICE") private readonly authService: ClientProxy,
    @Inject("USER_SERVICE") private readonly userService: ClientProxy,
    @Inject("PRESTATION_SERVICE") private readonly prestationService: ClientProxy,
    @Inject("REVIEW_SERVICE") private readonly reviewService: ClientProxy,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/auth")
  public getAuthHello() {
    return this.authService.send("getHello", {});
  }

  @Get("/user")
  public getUserHello() {
    return this.userService.send("getHello", {});
  }

  @Get("/prestation")
  public getPrestationHello() {
    return this.prestationService.send("getHello", {});
  }

  @Get("/review")
  public getReviewHello() {
    return this.reviewService.send("getHello", {});
  }
}
