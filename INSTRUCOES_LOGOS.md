# Instruções para Adicionar Logos

## 📋 Localização das Logos

As logos devem ser salvas na pasta:
```
c:\Users\Administrador\Desktop\SUAS_CADASTRO\public\img\
```

## 🖼️ Logos Necessárias

O sistema está preparado para exibir duas logos no cabeçalho:

1. **Logo da Prefeitura**: `logo_prefeitura.png`
2. **Logo do SCFV**: `logo_scfv.png`

## 📐 Especificações Recomendadas

- **Formato**: PNG (com fundo transparente de preferência)
- **Dimensões**: Máximo de 200px de largura x 80px de altura
- **Qualidade**: Alta resolução para melhor aparência
- **Tamanho do arquivo**: Recomendado até 500KB por logo

## 🔧 Como Adicionar as Logos

1. Copie os arquivos de logo para a pasta `public/img/`
2. Renomeie os arquivos conforme indicado acima:
   - `logo_prefeitura.png` - Logo da Prefeitura de Santo Amaro do Maranhão
   - `logo_scfv.png` - Logo do SCFV

3. As logos aparecerão automaticamente em:
   - Página inicial (`index.html`)
   - Painel administrativo (`admin.html`)

## ⚙️ Comportamento Atual

- Se as logos não forem encontradas, elas simplesmente não serão exibidas (não causarão erro)
- O sistema possui tratamento de erro (`onerror="this.style.display='none'"`)
- As logos são responsivas e se adaptam a diferentes tamanhos de tela

## 🎨 Alterações Realizadas

✅ **Removidos todos os emojis** da interface:
- Cabeçalhos
- Botões
- Cards de atividades
- Placeholders de busca
- Mensagens de erro e avisos

✅ **Adicionada estrutura profissional** para logos institucionais

✅ **Sistema preparado** para receber as logos oficiais da prefeitura e do SCFV

## 📝 Próximos Passos

1. Identifique as logos corretas da Prefeitura e do SCFV
2. Copie ou salve as logos na pasta `public/img/`
3. Certifique-se de que os nomes dos arquivos estejam corretos
4. Recarregue a página no navegador (F5) para ver as logos
