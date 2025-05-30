Create database estuda_ia;
show databases;
use estuda_ia;


-- 3️⃣ Cria as tabelas principais
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE usuarios_cursos (
    usuario_id INT PRIMARY KEY,
    curso_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curso_id INT,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE conteudos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    materia_id INT,
    pdf_professor VARCHAR(255),
    resumo_ia TEXT,
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);

-- 4️⃣ Cria a tabela usuario_materia
CREATE TABLE usuarios_materias (
    usuario_id INT,
    materia_id INT,
    PRIMARY KEY (usuario_id, materia_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);

-- 5️⃣ Cria a tabela materia_conteudo
CREATE TABLE materias_conteudos (
    materia_id INT,
    conteudo_id INT,
    PRIMARY KEY (materia_id, conteudo_id),
    FOREIGN KEY (materia_id) REFERENCES materias(id),
    FOREIGN KEY (conteudo_id) REFERENCES conteudos(id)
);


INSERT INTO cursos (nome) VALUES
('Engenharia da Computação'),
('Engenharia de Software'),
('Direito');

INSERT INTO materias (nome, curso_id) VALUES
('Sistemas Embarcados', 1),
('Programação Estruturada', 1),
('Sistemas Operacionais', 1),
('Programação Orientada a Objetos', 1);

INSERT INTO materias (nome, curso_id) VALUES
('Metodologias Ágeis', 2),
('Desenvolvimento Web', 2),
('Engenharia de Dados', 2);


INSERT INTO materias (nome, curso_id) VALUES
('Direito Internacional Público', 3),
('Direito Administrativo', 3);

INSERT INTO usuarios (nome, email) VALUES
('Arthur Schiller', 'arth_10@email.com'),
('Felipe', 'felipe01@email.com'),
('Lukas', 'luk_07@email.com'),
('Arthur Camaz', 'arthmaz14@email.com'),
('Hudson', 'hud.gva@email.com');


INSERT INTO usuarios_materias (usuario_id, materia_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

INSERT INTO usuarios_materias (usuario_id, materia_id) VALUES
(2, 5),
(2, 6),
(2, 7);

INSERT INTO usuarios_materias (usuario_id, materia_id) VALUES
(3, 8),
(3, 9);

INSERT INTO usuarios_materias (usuario_id, materia_id) VALUES
(4, 1),
(4, 2),
(4, 3),
(4, 4);

INSERT INTO usuarios_materias (usuario_id, materia_id) VALUES
(5, 8),
(5, 9);

show tables;
select * from usuarios;
select * from conteudos;
select * from materias;
select * from cursos;
select * from usuarios_materias;
select * from usuarios_cursos;