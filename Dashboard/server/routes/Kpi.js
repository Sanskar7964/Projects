import express from "express";
import KPI from "../models/KPI.js";
const router =  express.Router();

router.get("/Kpis", async(req,res)=>{
    try{
        const Kpis = await KPI.find();
        res.status(200).json(kpis);
    }
    catch (error){
        res.status(404).json({message:error.message});
    }
});
export default router;