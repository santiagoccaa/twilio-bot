import {Router}from 'express'
import { handleAddOrder } from './controller'

const router = Router()

router.post("/", handleAddOrder)

export default router