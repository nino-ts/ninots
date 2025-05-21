/**
 * Tipos e interfaces para o sistema de roteamento baseado em decoradores
 */

import { Type } from "@shared/types";
import { MiddlewareFunc } from "../http/routes";

/**
 * Definição de uma rota configurada através de decoradores
 */
export interface RouteDefinition {
    /** Método HTTP (GET, POST, etc) */
    method: string;

    /** Caminho da rota relativamente ao controlador */
    path: string;

    /** Nome do método no controlador que manipula esta rota */
    methodName: string;

    /** Middlewares específicos desta rota */
    middlewares: MiddlewareFunc[];

    /** Classe do controlador (preenchido durante processamento) */
    controllerClass?: Type<any>;
}
