import {Router} from 'express'
import { Conversation } from './controller'

const routes = Router()

routes.post("/", Conversation)

export default routes