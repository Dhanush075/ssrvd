import { Controller, Post, Response, Body, Param, Get, Delete } from "@nestjs/common";
import { ResultEntity } from '@skillmine-dev-public/response-util';
import { SevaService } from "../services/SevaService";
import { ISevas } from "../model/collections/Sevas";

@Controller('sevas')
export class SevasContorller {
   
    
    @Post("/create")
    async createNewSeva(@Response() res, @Body() body: ISevas) {
        try {
            const result = await SevaService.Instance.createNewSeva(body);
            return res.status(201).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Get Sevas By ID
     */
    @Get("/:seva_id")
    async getSevaByID(@Response() res, @Param("seva_id") seva_id: string) {
        try {
            const result = await SevaService.Instance.getSevaByID(seva_id);
            if (result) {
                return res.status(200).json({ data: result });
            } else {
                return res.status(404).json({ error: 'Seva not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    @Get("/")
    async getAllSevas(@Response() res) {
        try {
            const result = await SevaService.Instance.getAllSevas();
            if (result) {
                return res.status(200).json({ data: result });
            } else {
                return res.status(404).json({ error: 'Seva not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

   






}