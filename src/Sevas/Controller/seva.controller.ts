import { Controller, Post, Body, Param, Get, HttpException, HttpStatus, Query } from "@nestjs/common";
import { SevaService } from "../services/SevaService";
import { ISevas } from "../model/collections/Sevas";
import { HttpService } from "@nestjs/axios";
import { stringify, parse } from 'flatted';

@Controller('sevas')
export class SevasController {
    constructor(private readonly httpService: HttpService) { }
    @Post("/create")
    async createNewSeva(@Body() body: ISevas) {
        try {
            const result = await SevaService.Instance.createNewSeva(body);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException({
                success: false,
                error: 'Failed to create Seva'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/:seva_id")
    async getSevaByID(@Param("seva_id") seva_id: string) {
        try {
            const result = await SevaService.Instance.getSevaByID(seva_id);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            throw new HttpException({
                success: false,
                error: 'Failed to get Seva by ID'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/")
    async getAllSevas(@Query("getServices") getServices:boolean) {
        try {
            const result = await SevaService.Instance.getAllSevas(getServices);
            return   result;
        } catch (error) {
            throw new HttpException({
                success: false,
                error: 'Failed to get all Sevas'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
