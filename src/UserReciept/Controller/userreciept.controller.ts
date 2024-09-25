import { Controller, Post, Response, Body, Param, Get, Delete, Query } from "@nestjs/common";
import { IUserReciept } from "../model/collections/UserReciept";
import { UserRecieptService } from "../Services/UserRecieptService";


@Controller('user-reciept')
export class UserRecieptController {
   
    
  
    @Post("/createReciept")
    async createNewSeva(@Body() body: any) {
        const result = await UserRecieptService.Instance.createNewUserReciept(body);
        return  result ;
    }

    @Post('/getTotalCount')
    async getRecieptCountDateWise(@Body() body: any) {
  
      const result = await UserRecieptService.Instance.getRecieptCountDateWise(body);
      return { success: true, data: result };
  
    }

    @Get("/updatePaymentStatusInReciept/:id")
    async updatePaymentStatus(@Param("id") id: string) {
        const result = await UserRecieptService.Instance.updatePaymentStatus(id);
        return result;
    }

    /**
     * Get UserReciept By ID
     */
    @Get("/:userReciept_id")
    async getSevaByID(@Response() res, @Param("userReciept_id") userReciept_id: string) {
        try {
            const result = await UserRecieptService.Instance.getUserRecieptByID(userReciept_id);
            if (result) {
                return res.status(200).json({ data: result });
            } else {
                return res.status(404).json({ error: 'UserReciept not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    @Get("/")
    async getAllSevas(@Response() res) {
        try {
            const result = await UserRecieptService.Instance.getAllUserReciept();
            if (result) {
                return res.status(200).json({ data: result });
            } else {
                return res.status(404).json({ error: 'UserReciept not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: "UserReciept not found" });
        }
    }

   






}