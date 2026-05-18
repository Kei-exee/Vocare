from pydantic import BaseModel
from typing import List

class RespuestaItem(BaseModel):
    pregunta_id: int
    respuesta_id: int


class ResolverTestRequest(BaseModel):
    id_usuario: int
    respuestas: List[RespuestaItem]