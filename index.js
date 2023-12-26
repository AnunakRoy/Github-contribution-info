import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// loading the initial form
app.get('/', (req, res) => {
    res.render('initial.ejs');
});

// loading the main page
app.post('/submit', async (req, res) => {
  try {
    const githubLink = req.body.githubLink;
    const accessToken = req.body.bearerToken;
    //obtaining the username from url
    function extractUsernameFromGitHubLink(gitHubLink) {
      const regex = /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9-]+)/i;    
      const match = gitHubLink.match(regex);     
      return match ? match[3] : null;
    }
    const githubUsername = extractUsernameFromGitHubLink(githubLink);
    const apiUrl = 'https://api.github.com/graphql';
    // setting up the query for the graphql api github
    const query = `
      query {
        user(login: "${githubUsername}") {
            avatarUrl
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  color
                }
              }
            }
          }
          repositories(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              name
              owner {
                login
              }
              description
              stargazerCount
            }
          }
        }
      }
    `;
    //   setting the bearer token for authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extracting and sending data to index.ejs
    res.render('index.ejs', {
      githubUsername:githubUsername,
      avatarUrl: data.data.user.avatarUrl,
      contributionGraph: data.data.user.contributionsCollection.contributionCalendar,
      repositories: data.data.user.repositories.nodes,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error: Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
