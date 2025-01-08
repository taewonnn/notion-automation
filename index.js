require('dotenv').config();


const { Client } = require('@notionhq/client');

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
// https://www.notion.so/rainbow8/1435f6cbe2fd80c6b09feaf0467a6287?v=1435f6cbe2fd81b7b79f000c223cdb02&pvs=4
// https://www.notion.so/rainbow8/f4cb0f3df60f47d8aee73e82fea59b84?v=af5fb884bb2644798e71a70129e98437&pvs=4
const sourceDbId = '1435f6cbe2fd80c6b09feaf0467a6287';
const targetDbId = 'f4cb0f3df60f47d8aee73e82fea59b84';

async function moveOldDoneCards() {

  console.log('moveOldDoneCards 함수 시작');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const response = await notion.databases.query({
    database_id: sourceDbId,
    filter: {
      and: [
        { property: 'Status', status: { equals: 'Done' } },
        {
          property: 'Date',
          date: { before: sevenDaysAgo.toISOString() },
        },
      ],
    },
  });

  // console.log('!!',response);

  for (const page of response.results) {
    await notion.pages.create({
      parent: { database_id: targetDbId },
      properties: page.properties,
    });

    await notion.pages.update({
      page_id: page.id,
      archived: true,
    });
  }

  console.log('DONE: card 이동 완료!');
}

moveOldDoneCards();
