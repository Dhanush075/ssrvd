import { Controller, Post, Body, Param, Get, Query, HttpException, HttpStatus } from "@nestjs/common";
import { ISubSevas } from "../model/collections/SubSevas";
import { SubSevaService } from "../Services/SubSevaService";

@Controller('sub-sevas')
export class SubSevasController {

    @Post("/createSubSevas")
    async createNewSeva(@Body() body: ISubSevas) {
        const result = await SubSevaService.Instance.createNewSubSeva(body);
        return { data: result };
    }

    @Get("/:subseva_id")
    async getSevaByID(@Param("subseva_id") subseva_id: string) {
        const result = await SubSevaService.Instance.getSubSevaByID(subseva_id);
        return { data: result };
    }

    // @Get("/allSubsevas/:parentSevaRef")
    // async getAllSevas(@Param("parentSevaRef") parentSevaRef: string) {
    //     const result = await SubSevaService.Instance.getAllSubSevas(parentSevaRef);
    //     return { data: result };
    // }

    @Get("/")
    async getAllSubSevas(@Query("getsubServices") getsubServices: boolean, @Query("seva_type") seva_type: number) {
        try {
            const result = await SubSevaService.Instance.getAllSubSevas(getsubServices,seva_type);
            return result;
        } catch (error) {
            throw new HttpException({
                success: false,
                error: 'Failed to get all SubSevas'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
