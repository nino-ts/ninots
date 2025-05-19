/**
 * Testes unitários para UserService
 */

import { describe, expect, it, jest, beforeEach } from "bun:test";
import { User } from "../../core/domain/entities/user.entity";
import { UserService } from "../../core/application/services/user.service";
import { TestSetup, createRepositoryMock } from "../../core/testing/test-utils";
import { container } from "../../container";

describe("UserService", () => {
    let userService: UserService;
    let mockRepository: ReturnType<typeof createRepositoryMock>;

    beforeEach(() => {
        // Resetar o container
        TestSetup.resetContainer();

        // Criar mock do repositório
        mockRepository = createRepositoryMock({
            findByEmail: jest.fn(),
            findByNameContaining: jest.fn(),
        });

        // Registrar dependências mockadas
        container.bind("UserRepository", () => mockRepository);

        // Criar instância do serviço
        userService = new UserService();
    });

    describe("createUser", () => {
        it("deve criar um usuário com sucesso", async () => {
            // Preparação
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            // Mock do findByEmail retornando null (email não existe)
            mockRepository.findByEmail.mockResolvedValue(null);

            // Mock do método save
            mockRepository.save.mockImplementation(async (user: User) => {
                // Simular criação de ID
                user.id = 1;
                return user;
            });

            // Execução
            const result = await userService.createUser(userData);

            // Verificações
            expect(mockRepository.findByEmail).toHaveBeenCalledWith(
                userData.email
            );
            expect(mockRepository.save).toHaveBeenCalled();

            // Verificações do resultado
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.name).toBe(userData.name);
            expect(result.email).toBe(userData.email);
        });

        it("deve lançar erro quando o email já existe", async () => {
            // Preparação
            const userData = {
                name: "Test User",
                email: "existing@example.com",
                password: "password123",
            };

            // Mock do findByEmail retornando um usuário (email já existe)
            const existingUser = new User();
            existingUser.id = 1;
            existingUser.email = userData.email;

            mockRepository.findByEmail.mockResolvedValue(existingUser);

            // Execução e verificação
            await expect(userService.createUser(userData)).rejects.toThrow();

            // Verificar que save não foi chamado
            expect(mockRepository.save).not.toHaveBeenCalled();
        });
    });

    describe("getUserById", () => {
        it("deve retornar um usuário pelo ID", async () => {
            // Preparação
            const userId = 1;
            const mockUser = new User();
            mockUser.id = userId;
            mockUser.name = "Test User";
            mockUser.email = "test@example.com";

            mockRepository.findById.mockResolvedValue(mockUser);

            // Execução
            const result = await userService.getUserById(userId);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUser);
        });

        it("deve retornar null para ID inexistente", async () => {
            // Preparação
            const userId = 999;

            mockRepository.findById.mockResolvedValue(null);

            // Execução
            const result = await userService.getUserById(userId);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });
    });

    describe("getAllUsers", () => {
        it("deve retornar a lista de todos os usuários", async () => {
            // Preparação
            const mockUsers = [
                Object.assign(new User(), {
                    id: 1,
                    name: "User 1",
                    email: "user1@example.com",
                }),
                Object.assign(new User(), {
                    id: 2,
                    name: "User 2",
                    email: "user2@example.com",
                }),
            ];

            mockRepository.findAll.mockResolvedValue(mockUsers);

            // Execução
            const result = await userService.getAllUsers();

            // Verificações
            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
            expect(result.length).toBe(2);
        });
    });

    describe("updateUser", () => {
        it("deve atualizar um usuário existente", async () => {
            // Preparação
            const userId = 1;
            const updateData = {
                name: "Updated Name",
            };

            const existingUser = new User();
            existingUser.id = userId;
            existingUser.name = "Old Name";
            existingUser.email = "user@example.com";

            mockRepository.findById.mockResolvedValue(existingUser);
            mockRepository.save.mockImplementation(async (user: User) => user);

            // Execução
            const result = await userService.updateUser(userId, updateData);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result!.name).toBe(updateData.name);
            expect(result!.email).toBe(existingUser.email);
        });

        it("deve retornar null para usuário inexistente", async () => {
            // Preparação
            const userId = 999;
            const updateData = {
                name: "Updated Name",
            };

            mockRepository.findById.mockResolvedValue(null);

            // Execução
            const result = await userService.updateUser(userId, updateData);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockRepository.save).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe("deleteUser", () => {
        it("deve remover um usuário existente", async () => {
            // Preparação
            const userId = 1;

            const existingUser = new User();
            existingUser.id = userId;

            mockRepository.findById.mockResolvedValue(existingUser);

            // Execução
            const result = await userService.deleteUser(userId);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockRepository.remove).toHaveBeenCalledWith(userId);
            expect(result).toBe(true);
        });

        it("deve retornar false para usuário inexistente", async () => {
            // Preparação
            const userId = 999;

            mockRepository.findById.mockResolvedValue(null);

            // Execução
            const result = await userService.deleteUser(userId);

            // Verificações
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockRepository.remove).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
