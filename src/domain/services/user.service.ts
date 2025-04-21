import { User, type UserType } from "../entities/user.entity";
import { z } from "zod";

/**
 * Schema para validação na criação de usuário
 */
export const createUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email()
});

/**
 * Tipo inferido para criação de usuário
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Service responsável por gerenciar usuários
 */
export class UserService {
    private static instance: UserService;
    private users: User[] = [
        new User(1, "João", "joao@exemplo.com"),
        new User(2, "Maria", "maria@exemplo.com")
    ];

    /**
     * Construtor privado para implementar Singleton
     */
    private constructor() {}

    /**
     * Obtém a instância única do serviço
     */
    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    /**
     * Obtém todos os usuários
     * @returns Lista de usuários
     */
    public getAllUsers(): User[] {
        return this.users;
    }

    /**
     * Obtém um usuário pelo ID
     * @param id ID do usuário
     * @returns Usuário encontrado ou undefined
     */
    public getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    /**
     * Cria um novo usuário
     * @param data Dados do usuário
     * @returns Usuário criado
     * @throws {z.ZodError} Se os dados forem inválidos
     */
    public createUser(data: CreateUserInput): User {
        // Valida os dados
        const validData = createUserSchema.parse(data);
        
        // Gera um novo ID
        const newId = this.getNextId();
        
        // Cria o usuário
        const user = new User(newId, validData.name, validData.email);
        
        // Adiciona o usuário à lista
        this.users.push(user);
        
        return user;
    }

    /**
     * Atualiza um usuário existente
     * @param id ID do usuário
     * @param data Dados para atualização
     * @returns Usuário atualizado ou undefined se não encontrado
     * @throws {z.ZodError} Se os dados forem inválidos
     */
    public updateUser(id: number, data: Partial<UserType>): User | undefined {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return undefined;
        
        const user = this.users[index];
        user.update(data);
        
        return user;
    }

    /**
     * Remove um usuário
     * @param id ID do usuário
     * @returns true se removido com sucesso, false se não encontrado
     */
    public deleteUser(id: number): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }

    /**
     * Obtém o próximo ID disponível
     * @returns Próximo ID
     */
    private getNextId(): number {
        const maxId = this.users.reduce(
            (max, user) => (user.id > max ? user.id : max),
            0
        );
        return maxId + 1;
    }
} 