Nest.js 프로젝트!

npm i -g @nestjs/cli <= cli라서.. npx로 쓰기가 애매함 걍 -g ㄱㄱ

// cli 명령어..
nest new sleact-nest <= 프로젝트 생성..

nest g mo 모듈명 <= 모듈 생성
nest g s 모듈명 <= 모듈과 연결된 서비스 생성
nest g co 모듈명 <= 모듈 연결된 컨트롤러 생성

typeorm-extension 문서에서 가져온 것들
: db 생성, 드랍, seed 관련
"typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
"db:create": "ts-node ./node_modules/typeorm-extension/bin/cli.cjs db:create -d src/dataSource.ts",
"db:drop": "ts-node ./node_modules/typeorm-extension/bin/cli.cjs db:drop -d src/dataSource.ts",
"seed:run": "ts-node ./node_modules/typeorm-extension/bin/cli.cjs seed:run -d src/data-source.ts",
