import {Router} from 'express'
import { generateResponse } from './controller'

const routes = Router()

routes.post("/", generateResponse)

export default routes