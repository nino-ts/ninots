#!/usr/bin/env bun
/**
 * CLI do Ninots
 */

import { Command } from "commander";
import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

// Criar a instância do programa
const program = new Command();

// Configurar versão e descrição
program
    .name("ninots")
    .description("CLI para o framework Ninots")
    .version("0.1.0");

// Comando para criar um novo projeto
program
    .command("new <name>")
    .description("Cria um novo projeto Ninots")
    .action((name) => {
        createProject(name);
    });

// Comando para criar um novo controlador
program
    .command("make:controller <name>")
    .description("Cria um novo controlador")
    .option(
        "--resource",
        "Criar um controlador de recurso com todos os métodos CRUD"
    )
    .action((name, options) => {
        createController(name, options.resource);
    });

// Comando para criar uma nova entidade
program
    .command("make:entity <name>")
    .description("Cria uma nova entidade de domínio")
    .option(
        "--columns <columns>",
        "Lista de colunas separadas por vírgula (nome:tipo)"
    )
    .action((name, options) => {
        createEntity(name, options.columns);
    });

// Comando para criar um novo repositório
program
    .command("make:repository <name>")
    .description("Cria um novo repositório")
    .action((name) => {
        createRepository(name);
    });

// Função para criar um novo projeto
function createProject(name: string) {
    console.log(`Criando novo projeto: ${name}`);

    // Criar diretório do projeto
    const projectDir = join(process.cwd(), name);

    if (existsSync(projectDir)) {
        console.error(`Erro: O diretório ${name} já existe`);
        process.exit(1);
    }

    try {
        mkdirSync(projectDir);

        // Criar estrutura básica
        const directories = [
            "src/bootstrap",
            "src/config",
            "src/core/domain/entities",
            "src/core/domain/repositories",
            "src/core/application/services",
            "src/core/interfaces/http/controllers",
            "src/tests/unit",
            "src/tests/integration",
        ];

        directories.forEach((dir) => {
            mkdirSync(join(projectDir, dir), { recursive: true });
        });

        // Criar arquivo package.json
        const packageJson = {
            name,
            version: "0.1.0",
            description: "Projeto criado com Ninots",
            type: "module",
            scripts: {
                start: "bun src/main.ts",
                dev: "bun --watch src/main.ts",
                test: "bun test",
            },
            dependencies: {
                ninots: "^0.1.0",
            },
            devDependencies: {
                "@types/bun": "latest",
                typescript: "^5.0.0",
            },
        };

        writeFileSync(
            join(projectDir, "package.json"),
            JSON.stringify(packageJson, null, 2)
        );

        // Criar arquivo main.ts
        const mainTs = `/**
 * Ponto de entrada principal da aplicação
 */
import { initDatabase } from 'ninots';

async function bootstrap() {
  console.log('Inicializando aplicação...');
  
  try {
    const dbAdapter = await initDatabase();
    console.log('Aplicação inicializada com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
}

bootstrap();
`;

        writeFileSync(join(projectDir, "src/main.ts"), mainTs);

        // Criar arquivo tsconfig.json
        const tsConfig = {
            compilerOptions: {
                target: "esnext",
                module: "esnext",
                moduleResolution: "bundler",
                esModuleInterop: true,
                strict: true,
            },
            include: ["src/**/*"],
            exclude: ["node_modules"],
        };

        writeFileSync(
            join(projectDir, "tsconfig.json"),
            JSON.stringify(tsConfig, null, 2)
        );

        console.log(`\n✅ Projeto ${name} criado com sucesso!`);
        console.log(`\nPara iniciar o desenvolvimento:`);
        console.log(`  cd ${name}`);
        console.log(`  bun install`);
        console.log(`  bun dev`);
    } catch (error) {
        console.error("Erro ao criar projeto:", error);
        process.exit(1);
    }
}

// Função para criar um novo controlador
function createController(name: string, isResource: boolean = false) {
    console.log(`Criando controlador: ${name}`);

    const controllersDir = join(
        process.cwd(),
        "src/core/interfaces/http/controllers"
    );

    // Garantir que o diretório existe
    if (!existsSync(controllersDir)) {
        mkdirSync(controllersDir, { recursive: true });
    }

    const fileName = `${name.toLowerCase()}.controller.ts`;
    const filePath = join(controllersDir, fileName);

    if (existsSync(filePath)) {
        console.error(`Erro: O controlador ${fileName} já existe`);
        process.exit(1);
    }

    try {
        let content = `/**
 * ${name} Controller
 */
import { BaseController } from './base.controller';
import { HttpRequest, HttpResponse } from '../middlewares/auth.middleware';

export class ${name}Controller extends BaseController {
  async execute(request: HttpRequest): Promise<HttpResponse> {
`;

        if (isResource) {
            content += `    const operation = request.params.operation;
    
    switch (operation) {
      case 'index':
        return this.index(request);
      case 'show':
        return this.show(request);
      case 'store':
        return this.store(request);
      case 'update':
        return this.update(request);
      case 'destroy':
        return this.destroy(request);
      default:
        return this.clientError(\`Operação não suportada: \${operation}\`, 400);
    }
  }
  
  /**
   * Listar todos os recursos
   */
  private async index(request: HttpRequest): Promise<HttpResponse> {
    return this.ok({ message: 'Implementar lógica para listar recursos' });
  }
  
  /**
   * Exibir um recurso específico
   */
  private async show(request: HttpRequest): Promise<HttpResponse> {
    const id = request.params.id;
    return this.ok({ message: \`Implementar lógica para exibir recurso \${id}\` });
  }
  
  /**
   * Armazenar um novo recurso
   */
  private async store(request: HttpRequest): Promise<HttpResponse> {
    const data = request.body;
    return this.created({ message: 'Implementar lógica para criar recurso', data });
  }
  
  /**
   * Atualizar um recurso existente
   */
  private async update(request: HttpRequest): Promise<HttpResponse> {
    const id = request.params.id;
    const data = request.body;
    return this.ok({ message: \`Implementar lógica para atualizar recurso \${id}\`, data });
  }
  
  /**
   * Remover um recurso
   */
  private async destroy(request: HttpRequest): Promise<HttpResponse> {
    const id = request.params.id;
    return this.noContent();
  }`;
        } else {
            content += `    return this.ok({ message: 'Implementar lógica do controlador aqui' });
  }`;
        }

        content += "\n}\n";

        writeFileSync(filePath, content);

        console.log(`✅ Controlador ${fileName} criado com sucesso!`);
    } catch (error) {
        console.error("Erro ao criar controlador:", error);
        process.exit(1);
    }
}

// Função para criar uma nova entidade
function createEntity(name: string, columns: string = "") {
    console.log(`Criando entidade: ${name}`);

    const entitiesDir = join(process.cwd(), "src/core/domain/entities");

    // Garantir que o diretório existe
    if (!existsSync(entitiesDir)) {
        mkdirSync(entitiesDir, { recursive: true });
    }

    const fileName = `${name.toLowerCase()}.entity.ts`;
    const filePath = join(entitiesDir, fileName);

    if (existsSync(filePath)) {
        console.error(`Erro: A entidade ${fileName} já existe`);
        process.exit(1);
    }

    try {
        // Processar colunas
        const columnsList = columns ? columns.split(",") : [];
        let columnsCode = "";

        columnsList.forEach((column) => {
            const [columnName, columnType = "string"] = column.split(":");
            columnsCode += `
  /**
   * ${columnName}
   */
  @Column({ type: '${columnType}' })
  ${columnName}: ${columnType};
`;
        });

        const content = `/**
 * ${name} Entity
 */
import { BaseEntity } from './base.entity';
import { Entity, Column, PrimaryKey } from 'ninots';

@Entity('${name.toLowerCase()}s')
export class ${name} extends BaseEntity {
  /**
   * Identificador único
   */
  @PrimaryKey()
  id: number;
${columnsCode}
}
`;

        writeFileSync(filePath, content);

        console.log(`✅ Entidade ${fileName} criada com sucesso!`);
    } catch (error) {
        console.error("Erro ao criar entidade:", error);
        process.exit(1);
    }
}

// Função para criar um novo repositório
function createRepository(name: string) {
    console.log(`Criando repositório para: ${name}`);

    const interfaceDir = join(process.cwd(), "src/core/domain/repositories");
    const implDir = join(
        process.cwd(),
        "src/core/infrastructure/database/orm/repositories"
    );

    // Garantir que os diretórios existem
    if (!existsSync(interfaceDir)) {
        mkdirSync(interfaceDir, { recursive: true });
    }

    if (!existsSync(implDir)) {
        mkdirSync(implDir, { recursive: true });
    }

    // Interface do repositório
    const interfaceFileName = `${name.toLowerCase()}.repository.ts`;
    const interfaceFilePath = join(interfaceDir, interfaceFileName);

    // Implementação do repositório
    const implFileName = `${name.toLowerCase()}.repository.impl.ts`;
    const implFilePath = join(implDir, implFileName);

    if (existsSync(interfaceFilePath)) {
        console.error(
            `Erro: A interface de repositório ${interfaceFileName} já existe`
        );
        process.exit(1);
    }

    if (existsSync(implFilePath)) {
        console.error(
            `Erro: A implementação de repositório ${implFileName} já existe`
        );
        process.exit(1);
    }

    try {
        // Criar interface do repositório
        const interfaceContent = `/**
 * ${name} Repository Interface
 */
import { Repository } from './repository.interface';
import { ${name} } from '../entities/${name.toLowerCase()}.entity';

/**
 * Interface para o repositório de ${name.toLowerCase()}
 */
export interface ${name}Repository extends Repository<${name}, number> {
  /**
   * Métodos específicos para ${name} podem ser adicionados aqui
   */
}
`;

        writeFileSync(interfaceFilePath, interfaceContent);

        // Criar implementação do repositório
        const implContent = `/**
 * ${name} Repository Implementation
 */
import { BaseRepository } from '../base.repository';
import { ${name} } from '../../../../domain/entities/${name.toLowerCase()}.entity';
import { ${name}Repository } from '../../../../domain/repositories/${name.toLowerCase()}.repository';

/**
 * Implementação do repositório de ${name.toLowerCase()}
 */
export class ${name}RepositoryImpl extends BaseRepository<${name}> implements ${name}Repository {
  /**
   * Construtor
   */
  constructor() {
    super(${name});
  }
  
  /**
   * Métodos específicos para ${name} podem ser implementados aqui
   */
}
`;

        writeFileSync(implFilePath, implContent);

        console.log(
            `✅ Interface de repositório ${interfaceFileName} criada com sucesso!`
        );
        console.log(
            `✅ Implementação de repositório ${implFileName} criada com sucesso!`
        );
    } catch (error) {
        console.error("Erro ao criar repositório:", error);
        process.exit(1);
    }
}

// Processar argumentos da linha de comando
program.parse(process.argv);
