# Peachy Prep
  
## Inspiration
Ever since ChatGPT came out, my most frequent use for it _by far_ was to help me study for my courses. Over the past two years, I've gotten quite good at using it in a way that is most helpful for making content as digestible and easily understandable as possible for myself. Our goal was not only to streamline this for students already quite experienced at "prompt engineering" to effectively study, but also for students unfamiliar with this technology to take advantage of it.
We believe that increasing the rate of learning for students by even a small amount results in compounding effects that are incredibly significant. 

## What it does
Our project helps you study by making bullet points, flash cards, and quizzes from study materials like the course textbook, slides, and notes.
The user drops the various study materials they have. This may include presentation slides from class, a textbook, notes, documents, or all of the above! Once the user has submitted this, the user is greeted with a screen with bullet points summarizing the material. In addition to this, there are flashcards and quizzes that are available to the user to review and practice their material.  

## How we built it
frontend: react and tailwind
backend: express and javascript
database: supabase
open ai API
serpAPI

## Challenges we ran into
text extraction from multiple files and smartly prompting the model was tricky but we did it well. 
used users wrong answers to multiple choice questions to identify weak areas and propose resources from the internet.
speed was a key challenge we tackled, making api calls to models with large tokens is costly so we had to come up with clever ways to reduce time cost on the user's end, producing a smooth experience.

## Accomplishments that we're proud of
Successfully made an app that has is user faced and aims to make the user experience as frictionless as possible.

## What we learned
You can just do things. Conceiving an idea and bringing its first iteration to reality is both fun and very doable.

## What's next for Peachy Prep
We plan on adding memory to allow Peachy Prep to review all past study sessions with it so that it can help review for midterms and finals based on how the student did in each study session.

