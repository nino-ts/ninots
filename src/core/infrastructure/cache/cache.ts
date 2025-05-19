/**
 * Sistema de cache para o Ninots
 *
 * Implementa diferentes estratégias de cache
 */

/**
 * Interface básica para cache
 */
export interface Cache {
    /**
     * Obtém um valor do cache
     * @param key Chave do cache
     * @returns Valor associado à chave ou undefined se não encontrado
     */
    get<T>(key: string): Promise<T | undefined>;

    /**
     * Armazena um valor no cache
     * @param key Chave do cache
     * @param value Valor a ser armazenado
     * @param ttl Tempo de vida em segundos (opcional)
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;

    /**
     * Verifica se uma chave existe no cache
     * @param key Chave a verificar
     * @returns true se a chave existir e não tiver expirado
     */
    has(key: string): Promise<boolean>;

    /**
     * Remove uma entrada do cache
     * @param key Chave a remover
     */
    delete(key: string): Promise<void>;

    /**
     * Limpa todo o cache
     */
    clear(): Promise<void>;
}

/**
 * Entrada de cache com controle de expiração
 */
interface CacheEntry<T> {
    value: T;
    expiry?: number; // Timestamp de expiração
}

/**
 * Implementação de cache em memória
 */
export class MemoryCache implements Cache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    /**
     * Verifica se uma entrada está expirada
     * @param entry Entrada de cache
     * @returns true se a entrada estiver expirada
     */
    private isExpired(entry: CacheEntry<any>): boolean {
        return entry.expiry !== undefined && entry.expiry < Date.now();
    }

    /**
     * Limpa entradas expiradas do cache
     */
    private cleanup(): void {
        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Obtém um valor do cache
     * @param key Chave do cache
     * @returns Valor associado à chave ou undefined se não encontrado ou expirado
     */
    async get<T>(key: string): Promise<T | undefined> {
        const entry = this.cache.get(key);

        if (!entry) {
            return undefined;
        }

        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.value as T;
    }

    /**
     * Armazena um valor no cache
     * @param key Chave do cache
     * @param value Valor a ser armazenado
     * @param ttl Tempo de vida em segundos (opcional)
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const entry: CacheEntry<T> = {
            value,
            expiry: ttl !== undefined ? Date.now() + ttl * 1000 : undefined,
        };

        this.cache.set(key, entry);

        // Limpeza ocasional de entradas expiradas
        if (Math.random() < 0.1) {
            // 10% de chance de limpar a cada set
            this.cleanup();
        }
    }

    /**
     * Verifica se uma chave existe no cache
     * @param key Chave a verificar
     * @returns true se a chave existir e não tiver expirado
     */
    async has(key: string): Promise<boolean> {
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Remove uma entrada do cache
     * @param key Chave a remover
     */
    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    /**
     * Limpa todo o cache
     */
    async clear(): Promise<void> {
        this.cache.clear();
    }
}

/**
 * Factory para criar caches
 */
export class CacheFactory {
    /**
     * Cria uma instância de cache
     * @param type Tipo de cache
     * @returns Instância de cache configurada
     */
    static create(type: "memory"): Cache {
        switch (type) {
            case "memory":
                return new MemoryCache();
            default:
                return new MemoryCache();
        }
    }
}
