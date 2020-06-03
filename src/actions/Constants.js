import {Env} from '../config.js'

let Endpoint = 'https://api-ml-web-tool.herokuapp.com'

if (Env.mode === 'debug') {
  Endpoint = 'http://localhost:5000'
}

export const BaseUrl = Endpoint