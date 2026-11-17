VIDEO DOWNLOADER - INSTAGRAM E YOUTUBE
======================================

REQUISITOS
- Windows 10 ou 11
- Python 3.10 ou superior instalado
- Conexão com a internet

COMO INICIAR
1. Extraia todo o conteúdo do ZIP para uma pasta.
2. Dê dois cliques em INICIAR_NO_WINDOWS.bat.
3. Aguarde a instalação automática das bibliotecas.
4. Abra http://127.0.0.1:5000 no navegador.
5. Cole um link compatível. Com a opção automática marcada, o site começa
   a processar quando você cola o link. Também é possível clicar em BAIXAR VÍDEO.

OBSERVAÇÕES IMPORTANTES
- Este projeto usa yt-dlp para acessar formatos disponibilizados publicamente
  pelas plataformas. O melhor formato disponível pode variar por vídeo.
- Alguns vídeos podem exigir login, estar privados, bloqueados por região,
  protegidos ou indisponíveis. O aplicativo não tenta contornar essas barreiras.
- Use apenas vídeos que você tenha direito ou autorização para baixar.
- O site não adiciona marca-d'água nem créditos próprios. Ele não remove
  marcas-d'água, nomes ou créditos que já façam parte do vídeo original.
- O servidor local fica acessível apenas no próprio computador (127.0.0.1).
  Para publicar na internet, será necessário contratar hospedagem e configurar
  HTTPS, limites de uso, autenticação e armazenamento temporário.

ATUALIZAÇÃO
Para atualizar yt-dlp, abra o Prompt de Comando nesta pasta e execute:
py -m pip install -U yt-dlp
