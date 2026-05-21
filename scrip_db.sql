
-- LIMPIEZA (opcional para pruebas)
DROP TABLE IF EXISTS ruta_tema CASCADE;
DROP TABLE IF EXISTS rutas_aprendizaje CASCADE;
DROP TABLE IF EXISTS tema_categoria CASCADE;
DROP TABLE IF EXISTS maestria_tema CASCADE;
DROP TABLE IF EXISTS temas CASCADE;
DROP TABLE IF EXISTS pesos_categoria CASCADE;
DROP TABLE IF EXISTS respuestas CASCADE;
DROP TABLE IF EXISTS preguntas CASCADE;
DROP TABLE IF EXISTS maestrias CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

-- TABLA: categorias
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- TABLA: maestrias
CREATE TABLE maestrias (
    id_maestria SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INT REFERENCES categorias(id_categoria),
    duracion VARCHAR(50),
    modalidad VARCHAR(50)
);

-- TABLA: preguntas
CREATE TABLE preguntas (
    id_pregunta SERIAL PRIMARY KEY,
    pregunta TEXT NOT NULL
);

-- TABLA: respuestas (tipo Likert)
CREATE TABLE respuestas (
    id_respuesta SERIAL PRIMARY KEY,
    texto VARCHAR(50),
    valor INT
);

-- TABLA: pesos_categoria
CREATE TABLE pesos_categoria (
    id SERIAL PRIMARY KEY,
    pregunta_id INT REFERENCES preguntas(id_pregunta),
    categoria_id INT REFERENCES categorias(id_categoria),
    peso INT
);

-- TABLA: temas
CREATE TABLE temas (
    id_tema SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT
);

-- TABLA: maestria_tema
CREATE TABLE maestria_tema (
    id SERIAL PRIMARY KEY,
    id_maestria INT REFERENCES maestrias(id_maestria),
    id_tema INT REFERENCES temas(id_tema),
    nivel_importancia INT CHECK (nivel_importancia BETWEEN 1 AND 5)
);

-- TABLA: tema_categoria
CREATE TABLE tema_categoria (
    id SERIAL PRIMARY KEY,
    id_tema INT REFERENCES temas(id_tema),
    id_categoria INT REFERENCES categorias(id_categoria),
    peso INT
);

-- TABLA: rutas_aprendizaje
CREATE TABLE rutas_aprendizaje (
    id_ruta SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT
);

-- TABLA: ruta_tema
CREATE TABLE ruta_tema (
    id SERIAL PRIMARY KEY,
    id_ruta INT REFERENCES rutas_aprendizaje(id_ruta),
    id_tema INT REFERENCES temas(id_tema)
);

ALTER TABLE maestrias
ADD COLUMN universidad VARCHAR(150);

ALTER TABLE maestrias
ADD COLUMN sede VARCHAR(100);

-- CATEGORIAS
INSERT INTO categorias (nombre, descripcion) VALUES
('Negocios', 'Administración y gestión empresarial'),
('Tecnología', 'Software, infraestructura y transformación digital'),
('Derecho', 'Ciencias jurídicas y legales'),
('Salud', 'Psicología, medicina y bienestar'),
('Creativo', 'Diseño, arquitectura y multimedia'),
('Ambiental', 'Gestión ambiental y sostenibilidad'),
('Educación', 'Docencia y tecnología educativa'),
('Finanzas', 'Finanzas, auditoría y contabilidad'),
('Ingeniería', 'Procesos industriales y operaciones'),
('Recursos Humanos', 'Gestión del talento humano'),
('Comunicación', 'Marketing y comunicación estratégica'),
('Logística', 'Operaciones y cadena de suministro'),
('Investigación', 'Investigación científica y análisis'),
('Agroindustria', 'Producción y gestión agroindustrial');

-- MAESTRIAS
INSERT INTO maestrias
(nombre, categoria_id, duracion, modalidad, universidad, sede)
VALUES

-- NEGOCIOS
('MBA Ejecutivo', 1, '2 años', 'Fin de semana', 'Universidad Galileo', 'Guatemala'),
('Administración Financiera', 1, '2 años', 'Mixto', 'Universidad Mariano Gálvez', 'Guatemala'),
('Gerencia de Proyectos', 1, '2 años', 'Virtual', 'Universidad Da Vinci', 'Virtual'),
('Marketing Estratégico', 1, '2 años', 'Virtual', 'Universidad Rafael Landívar', 'Guatemala'),

-- TECNOLOGÍA
('Sistemas de Información', 2, '2 años', 'Mixto', 'Universidad Galileo', 'Guatemala'),
('Ciencia de Datos', 2, '2 años', 'Virtual', 'Universidad del Valle', 'Guatemala'),
('Inteligencia Artificial', 2, '2 años', 'Mixto', 'Universidad Galileo', 'Guatemala'),
('Ciberseguridad', 2, '2 años', 'Virtual', 'Universidad Mariano Gálvez', 'Virtual'),
('Transformación Digital', 2, '2 años', 'Mixto', 'Universidad Da Vinci', 'Guatemala'),

-- DERECHO
('Derecho Penal', 3, '2 años', 'Fin de semana', 'Universidad San Carlos', 'Guatemala'),
('Derecho Corporativo', 3, '2 años', 'Fin de semana', 'Universidad Rafael Landívar', 'Guatemala'),
('Derecho Tributario', 3, '2 años', 'Virtual', 'Universidad Mariano Gálvez', 'Virtual'),

-- SALUD
('Psicología Clínica', 4, '2 años', 'Presencial', 'Universidad Mariano Gálvez', 'Quetzaltenango'),
('Psicología Organizacional', 4, '2 años', 'Mixto', 'Universidad Rafael Landívar', 'Guatemala'),
('Salud Pública', 4, '2 años', 'Mixto', 'Universidad San Carlos', 'Guatemala'),

-- CREATIVO
('Diseño Gráfico Digital', 5, '2 años', 'Virtual', 'Universidad Galileo', 'Virtual'),
('Arquitectura y Urbanismo', 5, '2 años', 'Presencial', 'Universidad Rafael Landívar', 'Guatemala'),

-- AMBIENTAL
('Gestión Ambiental', 6, '2 años', 'Mixto', 'Universidad del Valle', 'Guatemala'),
('Recursos Naturales', 6, '2 años', 'Presencial', 'Universidad San Carlos', 'Petén'),

-- EDUCACIÓN
('Docencia Universitaria', 7, '2 años', 'Virtual', 'Universidad Mariano Gálvez', 'Virtual'),
('Tecnología Educativa', 7, '2 años', 'Virtual', 'Universidad Galileo', 'Virtual'),

-- FINANZAS
('Auditoría Financiera', 8, '2 años', 'Fin de semana', 'Universidad Mariano Gálvez', 'Guatemala'),
('Finanzas Corporativas', 8, '2 años', 'Mixto', 'Universidad Rafael Landívar', 'Guatemala'),
('Contabilidad Tributaria', 8, '2 años', 'Virtual', 'Universidad Da Vinci', 'Virtual'),

-- INGENIERÍA
('Ingeniería Industrial', 9, '2 años', 'Mixto', 'Universidad del Valle', 'Guatemala'),
('Gestión de Calidad', 9, '2 años', 'Virtual', 'Universidad Mariano Gálvez', 'Virtual'),
('Ingeniería de Procesos', 9, '2 años', 'Mixto', 'Universidad Galileo', 'Guatemala'),

-- RRHH
('Gestión del Talento Humano', 10, '2 años', 'Virtual', 'Universidad Mariano Gálvez', 'Virtual'),
('Recursos Humanos Estratégicos', 10, '2 años', 'Mixto', 'Universidad Rafael Landívar', 'Guatemala'),

-- COMUNICACIÓN
('Comunicación Estratégica', 11, '2 años', 'Virtual', 'Universidad Da Vinci', 'Virtual'),
('Marketing Digital', 11, '2 años', 'Virtual', 'Universidad Galileo', 'Virtual'),

-- LOGÍSTICA
('Logística y Supply Chain', 12, '2 años', 'Mixto', 'Universidad del Valle', 'Guatemala'),

-- INVESTIGACIÓN
('Investigación Científica', 13, '2 años', 'Virtual', 'Universidad San Carlos', 'Virtual'),

-- AGROINDUSTRIA
('Gestión Agroindustrial', 14, '2 años', 'Presencial', 'Universidad Rural', 'Escuintla');

-- RESPUESTAS
INSERT INTO respuestas (texto, valor) VALUES
('Nada', 0),
('Poco', 1),
('Neutral', 2),
('Mucho', 3),
('Totalmente', 4);

-- PREGUNTAS (35)
INSERT INTO preguntas (pregunta) VALUES
('¿Te gusta liderar equipos?'),
('¿Te interesa desarrollar tecnología?'),
('¿Disfrutas resolver problemas complejos?'),
('¿Te gusta trabajar con números?'),
('¿Te interesa ayudar emocionalmente a las personas?'),
('¿Te gusta investigar y aprender constantemente?'),
('¿Te interesa administrar empresas?'),
('¿Te gusta analizar información financiera?'),
('¿Te interesa diseñar soluciones creativas?'),
('¿Te interesa comprender el comportamiento humano?'),
('¿Te gusta enseñar o capacitar personas?'),
('¿Te interesa optimizar procesos?'),
('¿Te gusta trabajar bajo objetivos y metas?'),
('¿Te interesa el área legal y jurídica?'),
('¿Te interesa la seguridad informática?'),
('¿Te gustaría emprender un negocio?'),
('¿Te interesa el medio ambiente y sostenibilidad?'),
('¿Te gusta analizar datos y estadísticas?'),
('¿Te interesa la logística y operaciones?'),
('¿Te interesa el área agroindustrial?'),
('¿Te gusta desarrollar software?'),
('¿Te interesa la inteligencia artificial?'),
('¿Te gusta trabajar en equipo?'),
('¿Te interesa la contabilidad y auditoría?'),
('¿Te gusta gestionar proyectos?'),
('¿Te interesa la arquitectura o urbanismo?'),
('¿Te gusta comunicar ideas y estrategias?'),
('¿Te interesa trabajar en recursos humanos?'),
('¿Te interesa la investigación científica?'),
('¿Te gusta la innovación tecnológica?'),
('¿Te interesa trabajar con bases de datos?'),
('¿Te gustaría trabajar en educación virtual?'),
('¿Te interesa mejorar la productividad empresarial?'),
('¿Te interesa la transformación digital?'),
('¿Te gusta planificar estrategias empresariales?');

-- TEMAS
INSERT INTO temas (nombre, descripcion) VALUES
('Programación', 'Desarrollo de software'),
('Bases de Datos', 'SQL y modelado de datos'),
('Machine Learning', 'Aprendizaje automático'),
('Análisis de Datos', 'Interpretación de información'),
('Ciberseguridad', 'Protección de sistemas'),
('Cloud Computing', 'Infraestructura en nube'),
('Administración Empresarial', 'Gestión organizacional'),
('Finanzas', 'Gestión financiera'),
('Contabilidad', 'Procesos contables'),
('Auditoría', 'Control y evaluación financiera'),
('Marketing Digital', 'Publicidad y posicionamiento'),
('Psicología Organizacional', 'Comportamiento humano en empresas'),
('Psicología Clínica', 'Salud mental'),
('Investigación Científica', 'Métodos de investigación'),
('Docencia Virtual', 'Educación digital'),
('Gestión Ambiental', 'Sostenibilidad'),
('Logística', 'Cadena de suministro'),
('Gestión de Proyectos', 'Planificación y ejecución'),
('Legislación', 'Normativas jurídicas'),
('Arquitectura', 'Diseño arquitectónico'),
('Diseño UX/UI', 'Experiencia de usuario'),
('Agroindustria', 'Producción agroindustrial'),
('Transformación Digital', 'Digitalización empresarial'),
('Estadística', 'Análisis estadístico'),
('Recursos Humanos', 'Gestión del talento');

-- MAESTRIA_TEMA
INSERT INTO maestria_tema (id_maestria, id_tema, nivel_importancia) VALUES

-- IA
(7, 1, 5),
(7, 2, 5),
(7, 3, 5),
(7, 4, 5),

-- Ciencia de datos
(6, 2, 5),
(6, 4, 5),
(6, 24, 5),

-- Ciberseguridad
(8, 1, 4),
(8, 5, 5),
(8, 6, 4),

-- MBA
(1, 7, 5),
(1, 8, 4),
(1, 18, 5),

-- Finanzas
(23, 8, 5),
(23, 9, 4),
(23, 10, 4),

-- Psicología
(13, 13, 5),
(14, 12, 5),
(14, 25, 4),

-- Educación
(20, 15, 5),
(21, 15, 5),

-- Logística
(31, 17, 5),
(31, 18, 4),

-- Ambiental
(18, 16, 5),

-- Derecho
(10, 19, 5),
(11, 19, 5),

-- Arquitectura
(17, 20, 5),
(17, 21, 4),

-- Agroindustria
(33, 22, 5);

-- TEMA_CATEGORIA
INSERT INTO tema_categoria (id_tema, id_categoria, peso) VALUES

(1, 2, 5),
(2, 2, 5),
(3, 2, 5),
(4, 2, 4),
(5, 2, 5),
(6, 2, 4),

(7, 1, 5),
(8, 8, 5),
(9, 8, 5),
(10, 8, 5),

(11, 11, 5),

(12, 10, 5),
(13, 4, 5),

(14, 13, 5),

(15, 7, 5),

(16, 6, 5),

(17, 12, 5),

(18, 1, 4),
(18, 9, 4),

(19, 3, 5),

(20, 5, 5),
(21, 5, 5),

(22, 14, 5),

(23, 2, 5),

(24, 13, 4),

(25, 10, 5);

-- RUTAS_APRENDIZAJE
INSERT INTO rutas_aprendizaje (nombre, descripcion) VALUES
('Ruta IA', 'Preparación para inteligencia artificial'),
('Ruta Ciencia de Datos', 'Análisis y visualización de datos'),
('Ruta Ciberseguridad', 'Protección de sistemas'),
('Ruta MBA', 'Administración y liderazgo'),
('Ruta Psicología', 'Bases psicológicas y humanas'),
('Ruta Finanzas', 'Análisis financiero y contable'),
('Ruta Educación Virtual', 'Docencia y plataformas digitales'),
('Ruta Marketing Digital', 'Marketing y comunicación'),
('Ruta Logística', 'Operaciones y supply chain'),
('Ruta Agroindustrial', 'Gestión de producción agrícola');

-- RUTA_TEMA
INSERT INTO ruta_tema (id_ruta, id_tema) VALUES

-- IA
(1, 1),
(1, 2),
(1, 3),
(1, 4),

-- Ciencia de datos
(2, 2),
(2, 4),
(2, 24),

-- Ciberseguridad
(3, 1),
(3, 5),
(3, 6),

-- MBA
(4, 7),
(4, 18),

-- Psicología
(5, 12),
(5, 13),

-- Finanzas
(6, 8),
(6, 9),
(6, 10),

-- Educación
(7, 15),

-- Marketing
(8, 11),

-- Logística
(9, 17),

-- Agroindustria
(10, 22);



CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resultado_test (
    id_resultado SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resultado_categoria (
    id SERIAL PRIMARY KEY,
    id_resultado INT REFERENCES resultado_test(id_resultado),
    id_categoria INT REFERENCES categorias(id_categoria),
    puntaje NUMERIC(10,2)
);

CREATE TABLE recomendacion (
    id_recomendacion SERIAL PRIMARY KEY,
    id_resultado INT REFERENCES resultado_test(id_resultado),
    id_maestria INT REFERENCES maestrias(id_maestria),
    posicion INT CHECK (posicion BETWEEN 1 AND 3),
    puntaje NUMERIC(10,2)
);

CREATE TABLE respuesta_usuario (
    id SERIAL PRIMARY KEY,
    id_resultado INT REFERENCES resultado_test(id_resultado),
    id_pregunta INT REFERENCES preguntas(id_pregunta),
    id_respuesta INT REFERENCES respuestas(id_respuesta)
);