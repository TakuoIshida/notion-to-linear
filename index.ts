import { linearClient } from './linear/client.ts'

async function getMyIssues() {
  const me = await linearClient.viewer;
  const myIssues = await me.assignedIssues();

  if (myIssues.nodes.length) {
    myIssues.nodes.map(issue => console.log(`${me.displayName} has issue: ${issue.title}`));
  } else {
    console.log(`${me.displayName} has no issues`);
  }
}

getMyIssues();