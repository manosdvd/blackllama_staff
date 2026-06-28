# **Architectural Design, Compliance, and Deployment Blueprint for a Distributed Scout Camp Operations Portal**

The digital modernization of operations within youth-serving organizations requires an architecture that integrates full-stack engineering performance, reliable data-access authorization, localized geographic telemetry, and strict regulatory safety compliance1. Seasonal camp administration presents a unique operational landscape characterized by rapid staff onboarding cycles, low-bandwidth networks, and high-concurrency demands3. This blueprint presents a technical blueprint for a distributed camp operations portal constructed with Next.js, Netlify, and Supabase5. The platform integrates an automated recruitment engine, an MDX-based interactive handbook, a high-frequency weather and wildland fire forecasting framework, and a digital forum structured around Scouting America’s strict Youth Protection Policies7.

## **Core Framework Selection and DevOps Pipeline Strategy**

Selecting Next.js 16 as the core framework leverages React Server Components as the default development paradigm10. This pattern moves intensive rendering tasks and data fetching directly to the server side, which drastically reduces the initial JavaScript execution cost on mobile clients in remote locations11. By using server components, static and dynamic content are compiled on the server, resulting in faster Largest Contentful Paint (LCP) times and satisfying critical Core Web Vitals parameters11.

                               ┌───────────────────────────────┐  
                               │     GitHub Repository Main    │  
                               │      (Protected Branch)       │  
                               └───────────────┬───────────────┘  
                                               │  
                                       Push or Pull Request  
                                               │  
                                               ▼  
                               ┌───────────────────────────────┐  
                               │     Netlify Build Engine      │  
                               │  (@netlify/plugin-nextjs)     │  
                               └───────────────┬───────────────┘  
                                               │  
                                       Automatic Artifacts  
                                               │  
                                               ▼  
                      ┌─────────────────────────────────────────────────┐  
                      │                 Netlify Edge CDN                │  
                      ├────────────────────────┬────────────────────────┤  
                      │  Serverless Functions  │ Static Asset Offload   │  
                      │   (Node.js / Go)       │    (HTML, CSS, JS)     │  
                      └────────────────────────┴────────────────────────┘

The build and deployment process is managed via GitHub and Netlify, relying on Git as the single source of truth5. To ensure build stability, Netlify processes deployments automatically using the @netlify/plugin-nextjs adapter5. Standardizing deployment commands around next build allows the platform to automatically detect the directory structure and route requirements5.  
To prevent runtime failures during server-side execution, configuration modes like output: 'export' must be avoided, as fully static configurations disable the serverless functions required to execute Next.js API Route Handlers and Server Actions5. Environmental variables are partitioned: values prefixed with NEXT\_PUBLIC\_ are compiled directly into the client-side JavaScript bundle during the build step, while non-prefixed variables remain isolated on the server side to secure sensitive database strings and API credentials5.

| Architectural Feature | Next.js on Netlify Configuration | Next.js on Vercel Configuration | Next.js on Standalone Node Server |
| :---- | :---- | :---- | :---- |
| **Framework Integration Adapter** | @netlify/plugin-nextjs \[cite: 5\] | Native Next.js Deployment Engine15 | Standalone Server Output Compilation15 |
| **Average Cold Start Latency** | Approximately 3.0 seconds (Serverless)17 | Approximately 1.0 second (Serverless)17 | Zero cold starts (Persistent Process)15 |
| **Build Minute Quotas (Free Tier)** | 300 minutes per month (commercial use allowed)17 | 6,000 minutes per month (hobby usage only)17 | Custom hardware execution limits |
| **Preview Deployments** | Branch-based environments with split A/B testing17 | Pull Request automatic comments & Core Web Vitals analysis17 | Manual Docker configuration pipelines15 |
| **Maximum Serverless Execution** | 10 seconds (Free) / 26 seconds (Paid Plan)17 | 60 seconds (Pro) / 300 seconds (Enterprise)17 | Unlimited background thread processes15 |

Deploying to Netlify relies on GitHub-based integration5. Pull Requests automatically trigger preview environments, allowing camp administrators to test configuration changes in an isolated space before pushing updates to the main production branch14. Branch deployments are restricted via protected branch policies, ensuring that code updates from non-team contributors must pass automated testing pipelines before they can be merged20.  
To support collaborative development, Netlify's Visitor Access policy can be configured to auto-approve deployment requests from recognized Git contributors, balancing continuous integration with reliable access controls20. The deployment pipeline is structured with atomic symlink-swap releases to prevent site downtime22. These release configurations guarantee that no changes go live on the public URL until all compiled files have been fully uploaded to the global Content Delivery Network (CDN)20.

## **Supabase Database Schema and Advanced Row-Level Security**

Because Supabase exposes its database directly to client applications via its automated REST and Realtime APIs, Row-Level Security (RLS) is an essential mechanism to enforce data security directly within the PostgreSQL engine6. When RLS is enabled via standard SQL instructions (ALTER TABLE table\_name ENABLE ROW LEVEL SECURITY;), the target table defaults to a strict deny-all state6. Data only becomes accessible once explicit security policies are defined to permit read or write operations6.  
To automate this security boundary across a growing schema, developers can implement a DDL event trigger that automatically enables RLS on any newly created table24. This automated protection ensures that tables created during schema updates are secure by default, preventing accidental data exposure6.

SQL  
\-- DDL Event Trigger to automatically enable RLS on newly created tables  
CREATE OR REPLACE FUNCTION rls\_auto\_enable()  
RETURNS EVENT\_TRIGGER  
LANGUAGE plpgsql  
SECURITY DEFINER  
SET search\_path \= pg\_catalog  
AS $$  
DECLARE  
  cmd record;  
BEGIN  
  FOR cmd IN  
    SELECT \* FROM pg\_event\_trigger\_ddl\_commands()  
    WHERE command\_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')  
    AND object\_type IN ('table','partitioned table')  
  LOOP  
    IF cmd.schema\_name \= 'public' THEN  
      EXECUTE format('ALTER TABLE if exists %s ENABLE ROW LEVEL SECURITY', cmd.object\_identity);  
      RAISE LOG 'rls\_auto\_enable: Automatically enabled RLS on %', cmd.object\_identity;  
    END IF;  
  END LOOP;  
END;  
$$;

CREATE EVENT TRIGGER ensure\_rls  
ON ddl\_command\_end  
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')  
EXECUTE FUNCTION rls\_auto\_enable();

To prevent database slowdowns under high operational loads, RLS queries must avoid correlated subqueries inside their policy clauses, as these run on every evaluated row6. For example, a correlated subquery model scales with ![][image1] complexity, where ![][image2] represents the target table rows and ![][image3] represents the subquery table rows. By wrapping these checks inside a SECURITY DEFINER helper function, the database planner can execute an initPlan optimized query path, reducing complexity to ![][image4]6.  
This optimization can be represented as:  
![][image5]  
This formula indicates that the permission check is executed once and cached, leaving only low-cost index lookups for the remaining rows6.

SQL  
\-- Security Definer helper function to determine organization membership safely  
CREATE OR REPLACE FUNCTION is\_org\_member(p\_org\_id UUID)  
RETURNS BOOLEAN   
SECURITY DEFINER  
SET search\_path \= public  
AS $$  
BEGIN  
  RETURN EXISTS (  
    SELECT 1 FROM org\_memberships  
    WHERE org\_id \= p\_org\_id  
    AND user\_id \= (SELECT auth.uid())  
  );  
END;  
$$ LANGUAGE plpgsql;

Additionally, wrapping functions inside simple SELECT blocks (e.g., (SELECT auth.uid()) \= user\_id) caches the evaluation result for the duration of the SQL transaction25. This optimization helps prevent N+1 query patterns and can improve lookup speeds over raw function calls25.

SQL  
\-- Standardized User Scoped RLS Policy using cached UID evaluation  
CREATE POLICY "Users can only read their own profile"  
ON public.user\_profiles  
FOR SELECT  
TO authenticated  
USING (  
  (SELECT auth.uid()) IS NOT NULL   
  AND user\_id \= (SELECT auth.uid())  
);

When integrating role-based permissions, accessing custom claims embedded in the user's JWT metadata is significantly more performant than querying a physical database table on every RLS check6. These roles are read using the auth.jwt() function, which extracts parameters directly from the user's session token6.

SQL  
\-- Role-based RLS Policy utilizing custom claims extracted from JWT  
CREATE POLICY "Registrars can manage all applications"  
ON public.camp\_applications  
FOR ALL  
TO authenticated  
USING (  
  (auth.jwt() \-\> 'app\_metadata' \-\>\> 'role') \= 'registrar'  
);

| Database Role Group | Database Target Table | Applicable Postgres Action | Security Validation Condition (USING / WITH CHECK) | Query Index Requirements |
| :---- | :---- | :---- | :---- | :---- |
| **anon** | public\_songbook | SELECT | is\_public \= true \[cite: 6, 23\] | B-Tree index on column is\_public |
| **authenticated** | user\_profiles | SELECT / UPDATE | (SELECT auth.uid()) \= user\_id \[cite: 6, 26\] | B-Tree index on column user\_id \[cite: 6, 25\] |
| **authenticated** | camp\_applications | INSERT | (SELECT auth.uid()) \= applicant\_id \[cite: 24\] | B-Tree index on column applicant\_id |
| **authenticated** | training\_records | SELECT / INSERT | (SELECT auth.uid()) \= user\_id \[cite: 6, 26\] | Composite index on (user\_id, course\_id) \[cite: 6\] |
| **authenticated** | forum\_posts | UPDATE / DELETE | (auth.jwt() \-\> 'app\_metadata' \-\>\> 'role') \= 'moderator' \[cite: 6\] | B-Tree index on thread\_id |

Developers must be careful to avoid exposing the service\_role credential in client-side code, as this key bypasses all RLS checks6. The standard client library initialization must use the public anon key, ensuring that the database enforces row-level security policies on all direct API calls6.

## **Onboarding and Recruitment Workflows**

Seasonal staff onboarding requires an automated workflow that guides applicants through recruitment, preboarding, and compliance steps3. This process begins immediately after an offer is accepted, starting preboarding tasks like background checks, tax documents, and digital paperwork3. The application uses a stage-gate pattern where tasks are split into logical phases, ensuring compliance steps are finished in order before unlocking subsequent role-based training modules27.

                     ┌────────────────────────────────┐  
                     │ Applicant Submits Online Form  │  
                     └───────────────┬────────────────┘  
                                     │  
                                     ▼  
                     ┌────────────────────────────────┐  
                     │      Background Check Step     │  
                     │  (State & Federal Screening)   │  
                     └───────────────┬────────────────┘  
                                     │  
                                     ▼  
                     ┌────────────────────────────────┐  
                     │    Preboarding & Tax Forms     │  
                     │  (W-4, I-9, Direct Deposit)    │  
                     └───────────────┬────────────────┘  
                                     │  
                                     ▼  
                     ┌────────────────────────────────┐  
                     │ Youth Protection & CS95 Training│  
                     │    (Compliance Verification)   │  
                     └───────────────┬────────────────┘  
                                     │  
                                     ▼  
                     ┌────────────────────────────────┐  
                     │ Active Staff Profile Activation│  
                     └────────────────────────────────┘

The database architecture separates template structures from active onboarding instances28. When an applicant accepts an offer, the platform generates a unique instance tracking table populated with dynamic due dates calculated relative to their start date3.  
Because the portal processes applicant details, privacy protections must be designed to satisfy the Children’s Online Privacy Protection Act (COPPA)30. The database strictly prohibits collecting personal information from anyone under thirteen years of age, requiring instead that a parent or legal guardian submit the necessary data and consent30.

SQL  
\-- Table structure for managing seasonal onboarding instances  
CREATE TABLE public.onboarding\_instances (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  
  start\_date DATE NOT NULL,  
  current\_phase TEXT NOT NULL DEFAULT 'preboarding',  
  medical\_verified BOOLEAN NOT NULL DEFAULT false,  
  background\_passed BOOLEAN NOT NULL DEFAULT false,  
  ypt\_completed BOOLEAN NOT NULL DEFAULT false,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Index user\_id to ensure fast querying and performance during bulk imports  
CREATE INDEX ix\_onboarding\_user\_id ON public.onboarding\_instances(user\_id);

For a clean and accessible user experience, form layouts should follow modern mobile web design guidelines31. Text elements must use a minimum font size of 16px on mobile screens to prevent iOS Safari from zooming in on input fields and disrupting the layout31.  
Input fields should use the correct standard HTML autocomplete values (e.g., autocomplete="street-address", autocomplete="tel") to make filling out forms easier and reduce user friction32. Interactive elements must have a touch target of at least ![][image6] to remain easily clickable on mobile screens31.

## **Handbook and Digital Songbook Content Architecture**

A dynamic handbook and songbook require a scalable content structure that supports fast search indexing, offline compatibility, and rich visual layouts12. Storing and rendering content in Markdown with embedded JSX components (MDX) represents the modern standard for developer-maintained documentation platforms34. For content managed locally on the file system, utilizing the native @next/mdx compiler compiles markdown directly into React Server Components during the build phase12. This architecture ensures that content is served as raw, server-rendered HTML, sending zero client-side JavaScript for static documentation pages to improve performance in low-connectivity camp settings12.

                       ┌─────────────────────────┐  
                       │     Markdown Source     │  
                       │ (songbook/handbook files)│  
                       └────────────┬────────────┘  
                                    │  
                                    ▼  
                       ┌─────────────────────────┐  
                       │   @next/mdx Compiler    │  
                       └────────────┬────────────┘  
                                    │  
                                    ▼  
       ┌────────────────────────────────────────────────────────┐  
       │             React Server Components (RSC)             │  
       │     (Zero-JS static rendering of markdown text)       │  
       └────────────────────────────┬───────────────────────────┘  
                                    │  
                                    ▼  
                       ┌─────────────────────────┐  
                       │  High-Performance HTML  │  
                       │  (Rendered at the edge) │  
                       └─────────────────────────┘

The songbook is designed to render lyrics alongside musical notation12. To ensure a responsive layout on mobile screens, content is styled with Tailwind's typography engine and custom layout components12.

Code snippet  
\---  
title: "The Scout Wet-Weather Campfire Song"  
category: "Campfire"  
key: "G Major"  
\---

import { ChordBlock } from '@/components/music';

\#\# Verse 1

We gather round the campfire glowing bright,  
\<ChordBlock chords="G C D"\>  
Underneath the rainy skies of the night.  
\</ChordBlock\>  
No drop can dampen our scouting cheer,  
\<ChordBlock chords="Em C G"\>  
For the warmth of friendship is gathered here.  
\</ChordBlock\>

When rendering dynamic or remote MDX sources (such as markdown retrieved from external repositories or a database), the platform implements next-mdx-remote-client34. This package supports MDX v3, provides native error boundaries in the App Router, and parses custom frontmatter and scoped variables at runtime36. For performance-critical pages, remote-mdx provides a lightweight option that reduces package size and works efficiently with Next.js's Turbopack dev server37.

TypeScript  
// App Router dynamic page rendering remote MDX content  
import { getRemoteMDXContent } from '@/lib/content';  
import { MDXRemote } from 'remote-mdx/rsc';  
import { notFound } from 'next/navigation';

interface HandbookPageProps {  
  params: Promise\<{ slug: string }\>;  
}

export default async function HandbookPage({ params }: HandbookPageProps) {  
  const resolvedParams \= await params;  
  const content \= await getRemoteMDXContent(resolvedParams.slug);

  if (\!content) {  
    return notFound();  
  }

  return (  
    \<article className\="prose dark:prose-invert max-w-none px-4 md:px-8"\>  
      \<MDXRemote source\={content.body} /\>  
    \</article\>  
  );  
}

To streamline handbook and songbook updates, teams can use Obsidian-compatible markdown repositories33. Authors can clip reference materials using the Obsidian Web Clipper browser extension and pull images locally to keep references intact33.  
An automated pipeline then processes these files, using Obsidian's visual graph views and Dataview plugin metadata to organize pages into structured categories33. This pipeline runs an incremental Map-Reduce job that deduplicates overlapping terms and synthesizes the content into a clean, interlinked folder hierarchy, keeping documentation updated automatically33.

## **High-Frequency Weather and Wildfire Geotargeted Alert Systems**

Operating a wilderness camp safely requires real-time access to accurate weather and fire telemetry39. The National Weather Service (NWS) API provides open access to localized meteorological forecasts, alerts, and grid metrics9. The system first calls the /points/{latitude},{longitude} endpoint to retrieve the grid coordinates (such as the specific forecast office and coordinate pair)9.  
The application then requests the twelve-hour or hourly forecast periods via the respective grid points endpoint9. Active regional hazards, like Red Flag Warnings, are retrieved using state-level active alerts endpoints (e.g., /alerts/active?area=AZ)9.

                     ┌───────────────────────────┐  
                     │    NWS Grid Lookup API    │  
                     │  (/points/lat,long endpoint)│  
                     └─────────────┬─────────────┘  
                                   │  
                                   ▼  
                     ┌───────────────────────────┐  
                     │  Dynamic Grid Forecasts   │  
                     │  (12-hour/hourly records) │  
                     └─────────────┬─────────────┘  
                                   │  
                                   ▼  
                     ┌───────────────────────────┐  
                     │   InciWeb & NIFC Feeds    │  
                     │  (Active fire perimeters)  │  
                     └─────────────┬─────────────┘  
                                   │  
                                   ▼  
              ┌──────────────────────────────────────────┐  
              │          Scheduled Edge Poller           │  
              │ (Caches data to avoid serverless timeout)│  
              └────────────────────┬─────────────────────┘  
                                   │  
                                   ▼  
                     ┌───────────────────────────┐  
                     │      Staff Alerts Hub     │  
                     │   (UI/SMS notification)   │  
                     └─────────────┴─────────────┘

The NWS API uses a cache-friendly model designed to minimize server load9. While rate limits are generous, the API returns a standard 503 Service Unavailable error if these limits are exceeded, though requests typically clear within five seconds9.  
To prevent client requests from triggering rate limits, queries should be made through a serverless proxy layer9. Additionally, the integration must account for upstream data issues, such as the MADIS ingest bug (which can cause missing 24-hour temperature records outside the Central time zone) or typical 20-minute delays in station observation reports9.

TypeScript  
// Next.js Route Handler for caching NWS alerts to prevent rate limits  
import { NextResponse } from 'next/server';

export async function GET() {  
  const forecastOffice \= process.env.NWS\_OFFICE || 'PSR';  
  const gridX \= process.env.NWS\_GRID\_X || '12';  
  const gridY \= process.env.NWS\_GRID\_Y || '34';  
  const targetUrl \= \`https://api.weather.gov/gridpoints/${forecastOffice}/${gridX},${gridY}/forecast/hourly\`;

  try {  
    const response \= await fetch(targetUrl, {  
      headers: {  
        'User-Agent': '(CampOperationsPortal, contact@scoutcamp.org)',  
      },  
      next: { revalidate: 900 } // Cache data for 15 minutes to avoid rate limit spikes  
    });

    if (\!response.ok) {  
      throw new Error(\`NWS API returned status: ${response.status}\`);  
    }

    const data \= await response.json();  
    return NextResponse.json(data.properties.periods\[0\]);  
  } catch (error) {  
    console.error('NWS fetch error:', error);  
    return NextResponse.json({ error: 'Failed to retrieve forecast telemetry.' }, { status: 502 });  
  }  
}

For real-time wildfire tracking, the platform pulls active fire location and perimeter coordinates from the National Interagency Fire Center (NIFC) IRWIN feeds and the Western Fire Chiefs Association (WFCA) platforms39. To provide detailed mapping, the interface parses geospatial data from multiple satellite sources39.  
The resolutions of these satellite data bands can be modeled as:  
![][image7]  
This classification ensures that mapping features fall back to the appropriate detail level based on sensor availability39.

| Telemetry Source Feed | Spatial Resolution Class | Temporal Frequency Rate | Key Extraction Parameters | Caching Strategy |
| :---- | :---- | :---- | :---- | :---- |
| **GOES Geostationary (ABI)** | \~2000 meters39 | 5-minute refresh loops39 | True Color cloud Cover & Smoke Plumes39 | Direct CDN dynamic stream bypass |
| **MODIS (Terra / Aqua)** | 1000 meters39 | 1 to 2 passes daily39 | Thermal anomaly hot spot indicators39 | Cached on a 6-hour background cron15 |
| **VIIRS (Suomi NPP / NOAA)** | 375 meters39 | 12-hour orbit intervals39 | Active fire footprint lines39 | Cached on a 3-hour background cron39 |
| **Landsat 8 / 9 Thermal** | 30 meters39 | 8-day satellite pass cycles39 | Detail-level thermal boundaries39 | Long-term GIS database storage6 |
| **PulsePoint Dispatch Feed** | Geocoded Point | Real-time incident triggers39 | Localized 911 dispatch calls39 | Realtime WebSocket subscription6 |

Because processing complex geospatial perimeters can easily exceed standard serverless execution limits, the portal uses a background worker approach17. A background cron job on a dedicated server (like Render or Northflank) runs the heavy geospatial processing and saves the sanitized results to Supabase15. This allows Next.js API endpoints to load the processed GIS coordinates instantly, keeping the map fast and responsive17.

## **Scouting America Safety Policy and Digital Compliance Frameworks**

Developing digital platforms for youth organizations requires strict adherence to Scouting America’s Youth Protection Policies (YPT) to ensure child safety and data privacy1. The core requirement is the absolute prohibition of one-on-one contact between an adult volunteer or staff member and a youth participant1. To enforce this policy digitally, the portal completely disables direct messaging, private chats, or hidden channels between adult and youth accounts7.

  \[Adult Staff User\] ───► Writes Message ───► \[Compliance CC Engine\]  
                                                     │  
                                           ┌─────────┴─────────┐  
                                           ▼                   ▼  
                                    \[Youth User\]     \[Parent/Leader CC\]

Any electronic communication between an adult and a youth must occur in an open, public forum, or include a registered parent or legal guardian carbon-copied (CC) on the thread7. The database schema enforces this rule with a composite table linking youth accounts directly to their parents or guardians6. If a staff member sends an in-app message or notification to a youth, the platform automatically appends the mapped parent profile and an active safety officer profile to the thread, blocking the message if these safety linkages are missing48.

SQL  
\-- Table structure for establishing direct youth-to-parent compliance links  
CREATE TABLE public.parent\_youth\_associations (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  parent\_id UUID NOT NULL REFERENCES public.user\_profiles(user\_id) ON DELETE CASCADE,  
  youth\_id UUID NOT NULL REFERENCES public.user\_profiles(user\_id) ON DELETE CASCADE,  
  verified BOOLEAN NOT NULL DEFAULT false,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  CONSTRAINT chk\_different\_user CHECK (parent\_id \<\> youth\_id)  
);

\-- Index the pairing to ensure fast RLS validation checks  
CREATE INDEX ix\_parent\_youth\_pairing ON public.parent\_youth\_associations(parent\_id, youth\_id);

To prevent cyberbullying and policy infractions, all user-generated content is routed through the OpenAI Moderation API before being saved to the database8. This check runs inside Next.js Server Actions to ensure API keys are never exposed to the client16. If the API flags a post for harassment, self-harm, or inappropriate content involving minors, the database transaction is blocked, and the infraction is logged for review2.

TypeScript  
// Next.js Server Action with built-in Youth Protection and content moderation  
"use server";

import { getOpenAIClient } from "@/lib/openai-client";  
import { createClient } from "@supabase/supabase-js";

const supabase \= createClient(  
  process.env.SUPABASE\_URL\!,  
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\! // Securely bypassed solely on server to record incidents  
);

export async function processUserPost(userId: string, threadId: string, userMessage: string) {  
  const openai \= getOpenAIClient();  
  if (\!openai) {  
    throw new Error("Content safety system is currently offline.");  
  }

  // Evaluate user content through the Moderation API  
  const response \= await openai.moderations.create({ input: userMessage });  
  const \[evaluation\] \= response.results;

  if (evaluation.flagged) {  
    // Lock the incident data to a secure table for mandatory safety reporting  
    await supabase.from("incident\_reports").insert({  
      reporter\_id: "SYSTEM",  
      subject\_id: userId,  
      incident\_category: "CONTENT\_SAFETY\_VIOLATION",  
      incident\_narrative: \`Automated content moderation flag: ${userMessage}\`,  
      flagged\_details: evaluation.categories,  
    });

    throw new Error("Submission rejected: Content violates camp safety guidelines.");  
  }

  // Save the approved post to the database  
  return await supabase.from("posts").insert({  
    author\_id: userId,  
    thread\_id: threadId,  
    body: userMessage,  
    created\_at: new Date().toISOString()  
  });  
}

Camp staff must hold a valid Youth Protection Training certification from the My.Scouting.org portal2. The portal tracks this requirement by storing staff training records, including their unique National Camp Accreditation Program (NCAP) course codes (e.g., training code CS95 for camp staff safety under requirement SQ-402.B.2)2.  
These records are configured with a strict biennial expiration policy46. If a staff member's certification expires during the camp season, the system automatically revokes their access privileges until they complete a renewal course and upload their new training certificate2.

SQL  
\-- Table structure for tracking mandatory youth safety certifications  
CREATE TABLE public.safety\_trainings (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  user\_id UUID NOT NULL REFERENCES public.user\_profiles(user\_id) ON DELETE CASCADE,  
  course\_code TEXT NOT NULL DEFAULT 'CS95', \-- NCAP safety training classification  
  cert\_number TEXT NOT NULL,  
  completion\_date DATE NOT NULL,  
  expiration\_date DATE NOT NULL,  
  verified BOOLEAN NOT NULL DEFAULT false,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Index training expiration dates to allow fast automated notifications  
CREATE INDEX ix\_training\_expiration ON public.safety\_trainings(expiration\_date);

In line with Scouting's Barriers to Abuse, the platform implements strict camera and geofencing limits8. The application analyzes geolocation coordinates and metadata on media uploads, rejecting any submissions originating from designated privacy zones like restrooms or shower houses8.  
Additionally, the interface displays prominent instructions for reporting safety issues, including direct links to the 24-hour Scouting America safety helpline (1-844-SCOUTS1) to ensure quick escalation of policy violations2.

## **AI-First Development Workflows and Tooling Infrastructure**

To accelerate development and maintain architectural standards, engineering teams should establish AI-assisted workflows using modern developer tooling53. Google’s Antigravity 2.0 provides an agent-first platform that functions as an operating system for developer agents, utilizing integrated browser environments to automate end-to-end testing and QA loops53. Custom skills and plugins are configured globally to ground the agent's code generation, preventing issues like the use of heavy polyfills by prioritizing modern native browser APIs55.  
The Antigravity application can be deployed across macOS, Windows, or Linux platforms56. For Linux systems, deploying via the .tar.gz binary bundle automatically configures a single integrated application icon, managing both the code workspace and the background agent manager from one interface56.

┌────────────────────────────────────────────────────────┐  
│               Antigravity 2.0 CLI / IDE                │  
├────────────────────────────────────────────────────────┤  
│  /planning (Swaps model to Medium/High thinking level) │  
│  /fast     (Swaps model to Low thinking level)         │  
│  /mcp      (Queries mcp\_config.json server integrations)│  
│  /skills   (Renders active agent skill validations)    │  
└────────────────────────────────────────────────────────┘

The coding environment uses specialized skills to automate formatting and linting tasks57. For example, the git-commit-formatter skill reads code diffs to automatically write clean Conventional Commits57. The license-header-adder uses custom templates (e.g., HEADER\_TEMPLATE.txt) to automatically prepend license headers to source files, adapting comments to match the target language (such as converting C-style block comments to Python \# characters)57. Additionally, the json-to-pydantic skill simplifies backend development by generating typed Pydantic models directly from JSON structures57.

JSON  
// Configuration file located at \~/.gemini/config/mcp\_config.json  
{  
  "mcpServers": {  
    "google-developer-knowledge": {  
      "url": "https://developerknowledge.googleapis.com/mcp",  
      "authProviderType": "google\_credentials",  
      "oauth": {  
        "scopes": \[  
          "https://www.googleapis.com/auth/cloud-platform"  
        \]  
      },  
      "timeout": 30000,  
      "headers": {  
        "X-goog-user-project": "camp-operations-portal-123"  
      }  
    }  
  }  
}

Since the original OpenAI Codex API was deprecated in early 2023, developers have transitioned to advanced models like GPT-4o-mini and Claude 3.5 Sonnet, which are integrated via environments like GitHub Copilot and Claude Code58. Developers can replicate early Codex multi-file context behaviors by maintaining structured codebase context files, utilizing lightweight task backlogs, and appending persistent instruction definitions within an AGENTS.md file at the root of the workspace60.

Markdown  
\# AGENTS.md \- Persistent Project Directives and Coding Guidelines

\#\# Context & Standards

\- Framework Target: Next.js 16 with App Router and Server Components.  
\- Security Target: PostgreSQL Row-Level Security enabled on all schemas.  
\- Styling Guidelines: Mobile-first layouts using Tailwind CSS.  
\- Form Elements: 16px minimum font size, 44x44px touch targets.  
\- Communication Rules: Absolute prohibition of direct messaging between adult and youth accounts.

## **Technical Recommendations and Implementation Roadmap**

To deliver a secure, high-performance portal for camp operations, the development team should execute the following phase-based implementation schedule:

\[Phase 1: Foundation\] ────► \[Phase 2: Onboarding\] ────► \[Phase 3: Integration\]  
 (RSC & RLS Triggers)        (COPPA & Phase Gates)       (NWS Proxy & Live Map)  
                                                                    │  
                                                                    ▼  
                                                        \[Phase 4: Compliance\]  
                                                         (CC Engine & OpenAI)

### **Phase 1: Core Database and Security Setup**

Ensure that RLS is enabled across all tables from day one by configuring the Postgres DDL event trigger6. Define standard user roles and wrap permission checks inside SECURITY DEFINER functions to maintain performance and prevent subquery bottlenecking6.

### **Phase 2: Onboarding and Recruitment Engine**

Construct the onboarding form screens following a mobile-first responsive layout, ensuring a minimum 16px font size and at least ![][image6] touch targets31. Incorporate COPPA age verifications to restrict registration access for applicants under thirteen without a parent or guardian30.

### **Phase 3: External API Telemetry Layer**

Build NWS weather caching routes within Next.js API endpoints to bypass rate limits, using a 15-minute revalidation cache9. Configure background processors on a dedicated worker to parse active fire perimeters from the InciWeb and NIFC IRWIN streams, saving the processed coordinates directly to Supabase15.

### **Phase 4: Scouting America Communication Compliance**

Disable direct messaging across the portal7. Implement the automated CC system to ensure all communication with youth includes a parent and a second leader8. Finally, route all forum posts through the OpenAI Moderation API before writing them to the database16.

#### **Works cited**

1. Youth Safety | Scouting America, [https://www.scouting.org/about/youth-safety/](https://www.scouting.org/about/youth-safety/)  
2. Youth Protection | Scouting America, [https://www.scouting.org/training/safeguarding-youth/](https://www.scouting.org/training/safeguarding-youth/)  
3. Onboard Seasonal Employees Efficiently at Scale | Rival HR, [https://rival-hr.com/onboarding-seasonal-employees-2/](https://rival-hr.com/onboarding-seasonal-employees-2/)  
4. Free Download Seasonal Hiring Onboarding Template \- Meegle, [https://www.meegle.com/en\_us/advanced-templates/retail\_store\_operations\_management/seasonal\_hiring\_onboarding\_template](https://www.meegle.com/en_us/advanced-templates/retail_store_operations_management/seasonal_hiring_onboarding_template)  
5. How to Deploy a Next.js App on Netlify (2026) \- Complete Guide \- Kuberns, [https://kuberns.com/blogs/deploy-nextjs-on-netlify/](https://kuberns.com/blogs/deploy-nextjs-on-netlify/)  
6. Supabase Row Level Security Guide 2026: Real Examples \- AgileSoftLabs Blog, [https://www.agilesoftlabs.com/blog/2026/06/supabase-row-level-security-guide-2026](https://www.agilesoftlabs.com/blog/2026/06/supabase-row-level-security-guide-2026)  
7. Scouting America Social Media Guidelines, [https://scoutingwire.org/social-media-guidelines/](https://scoutingwire.org/social-media-guidelines/)  
8. youth protection & 2-deep leadership \- Michigan Crossroads Council, [https://michiganscouting.org/wp-content/uploads/2023/10/YPT-at-Camp-Web.pdf](https://michiganscouting.org/wp-content/uploads/2023/10/YPT-at-Camp-Web.pdf)  
9. API Web Service \- National Weather Service, [https://www.weather.gov/documentation/services-web-api](https://www.weather.gov/documentation/services-web-api)  
10. Web frameworks: 2025 in review \- Netlify, [https://www.netlify.com/blog/web-frameworks-2025-year-in-review/](https://www.netlify.com/blog/web-frameworks-2025-year-in-review/)  
11. How to Master Next.js in 2026: 15+ Advanced Techniques Senior Devs Can't Ignore, [https://medium.com/@hashbyt/how-to-master-next-js-in-2026-15-advanced-techniques-senior-devs-cant-ignore-93e09f1c728d](https://medium.com/@hashbyt/how-to-master-next-js-in-2026-15-advanced-techniques-senior-devs-cant-ignore-93e09f1c728d)  
12. Building a Modern Blog with MDX and Next.js 16, [https://www.mdxblog.io/code/building-a-modern-blog-with-mdx-and-nextjs-16](https://www.mdxblog.io/code/building-a-modern-blog-with-mdx-and-nextjs-16)  
13. Building Role-Based Access Control (RBAC) with Supabase Row-Level Security \- Medium, [https://medium.com/@lakshaykapoor08/building-role-based-access-control-rbac-with-supabase-row-level-security-c82eb1865dfd](https://medium.com/@lakshaykapoor08/building-role-based-access-control-rbac-with-supabase-row-level-security-c82eb1865dfd)  
14. The Best GitOps Deployment Platforms in 2026 \- Railway Blog, [https://blog.railway.com/p/best-gitops-deployment-platforms-2026](https://blog.railway.com/p/best-gitops-deployment-platforms-2026)  
15. Best Hosting for Next.js in 2026 \- Lucky Media, [https://www.luckymedia.dev/guides/best-nextjs-hosting](https://www.luckymedia.dev/guides/best-nextjs-hosting)  
16. How to Integrate OpenAI in Next.js (App Router Tutorial) | Erratum Solutions, [https://www.erratums.com/blogs/how-to-integrate-openai-in-nextjs](https://www.erratums.com/blogs/how-to-integrate-openai-in-nextjs)  
17. Vercel vs Netlify 2026: Complete Comparison Guide \- TECHSY, [https://techsy.io/en/blog/vercel-vs-netlify](https://techsy.io/en/blog/vercel-vs-netlify)  
18. Employee Onboarding & Offboarding Workflow Pattern: Orchestrating the Hire-to-Retire Lifecycle \- Stonebranch, [https://www.stonebranch.com/blog/employee-onboarding-and-offboarding-workflow-pattern-orchestrating-the-hire-to-retire-lifecycle](https://www.stonebranch.com/blog/employee-onboarding-and-offboarding-workflow-pattern-orchestrating-the-hire-to-retire-lifecycle)  
19. Best Practice for Long-Running API Calls in Next.js Server Actions? : r/node \- Reddit, [https://www.reddit.com/r/node/comments/1mwged5/best\_practice\_for\_longrunning\_api\_calls\_in\_nextjs/](https://www.reddit.com/r/node/comments/1mwged5/best_practice_for_longrunning_api_calls_in_nextjs/)  
20. Deploy overview | Netlify Docs, [https://docs.netlify.com/deploy/deploy-overview/](https://docs.netlify.com/deploy/deploy-overview/)  
21. Best CI/CD tools in 2026 | Blog \- Northflank, [https://northflank.com/blog/best-ci-cd-tools](https://northflank.com/blog/best-ci-cd-tools)  
22. How to Automate Deployments: A Practical Guide (2026) \- DeployHQ, [https://www.deployhq.com/blog/deployment-automation-a-quick-overview](https://www.deployhq.com/blog/deployment-automation-a-quick-overview)  
23. Mastering Supabase RLS \- "Row Level Security" as a Beginner \- DEV Community, [https://dev.to/asheeshh/mastering-supabase-rls-row-level-security-as-a-beginner-5175](https://dev.to/asheeshh/mastering-supabase-rls-row-level-security-as-a-beginner-5175)  
24. Row Level Security | Supabase Docs, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
25. Troubleshooting | RLS Performance and Best Practices \- Supabase Docs, [https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)  
26. Supabase RLS Best Practices: Production Patterns for Secure Multi-Tenant Apps \- MakerKit, [https://makerkit.dev/blog/tutorials/supabase-rls-best-practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)  
27. 12 onboarding workflow examples from top companies to inspire your processes \- Moxo, [https://www.moxo.com/blog/onboarding-workflow-examples](https://www.moxo.com/blog/onboarding-workflow-examples)  
28. How to Build an Employee Onboarding App \- Lovable, [https://lovable.dev/guides/how-to-build-employee-onboarding-app](https://lovable.dev/guides/how-to-build-employee-onboarding-app)  
29. Onboarding Workflow Automation: What It Is, Key Benefits & How to Design It Right \- Knack, [https://www.knack.com/blog/onboarding-workflow-automation/](https://www.knack.com/blog/onboarding-workflow-automation/)  
30. Digital Safety and Online Scouting Activities, [https://www.scouting.org/health-and-safety/safety-moments/digital-safety-and-online-scouting-activities/](https://www.scouting.org/health-and-safety/safety-moments/digital-safety-and-online-scouting-activities/)  
31. Best Next.js Blog Templates 2026 | thefrontkit, [https://thefrontkit.com/blogs/best-nextjs-blog-templates-2026](https://thefrontkit.com/blogs/best-nextjs-blog-templates-2026)  
32. GoogleChrome/modern-web-guidance \- GitHub, [https://github.com/GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance)  
33. llm-wiki · GitHub, [https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f?permalink\_comment\_id=6111373](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f?permalink_comment_id=6111373)  
34. Getting started with Next.js 15 and MDX \- DEV Community, [https://dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k](https://dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k)  
35. What is the best blog system in 2026? : r/nextjs \- Reddit, [https://www.reddit.com/r/nextjs/comments/1rrufs9/what\_is\_the\_best\_blog\_system\_in\_2026/](https://www.reddit.com/r/nextjs/comments/1rrufs9/what_is_the_best_blog_system_in_2026/)  
36. Next.js Weekly \#118: Agentic Future, Portless, Virtual Scrolling, Geist Pixel, React's useTransition, next-mdx-remote-client : r/nextjs \- Reddit, [https://www.reddit.com/r/nextjs/comments/1rdmaps/nextjs\_weekly\_118\_agentic\_future\_portless\_virtual/](https://www.reddit.com/r/nextjs/comments/1rdmaps/nextjs_weekly_118_agentic_future_portless_virtual/)  
37. next-mdx-remote Alternatives \#438 \- GitHub, [https://github.com/hashicorp/next-mdx-remote/discussions/438](https://github.com/hashicorp/next-mdx-remote/discussions/438)  
38. How to Build Karpathy's LLM Wiki: The Complete Guide to AI-Maintained Knowledge Bases, [https://blog.starmorph.com/blog/karpathy-llm-wiki-knowledge-base-guide](https://blog.starmorph.com/blog/karpathy-llm-wiki-knowledge-base-guide)  
39. WFCA: Trusted Fire Information, Fire Map, and Resources \- Western Fire Chiefs Association, [https://wfca.com/maps-fire/](https://wfca.com/maps-fire/)  
40. Fire Weather \- National Weather Service, [https://www.weather.gov/fire/](https://www.weather.gov/fire/)  
41. Hazen Fire: The latest on the wildfire near Buckeye \- KJZZ, [https://www.kjzz.org/kjzz-news/2026-05-04/hazen-fire-the-latest-on-the-wildfire-near-buckeye](https://www.kjzz.org/kjzz-news/2026-05-04/hazen-fire-the-latest-on-the-wildfire-near-buckeye)  
42. Wildfire Situation \- Arizona Interagency Wildfire Prevention \- az.gov, [https://wildlandfire.az.gov/wildfire-situation](https://wildlandfire.az.gov/wildfire-situation)  
43. Staff Handbook \- Sea Base, [https://seabaseha.org/wp-content/uploads/2019/04/staffhandbook.pdf](https://seabaseha.org/wp-content/uploads/2019/04/staffhandbook.pdf)  
44. Youth Protection Digital | Atlanta Area Council | Scouting America, [https://www.scoutingatl.org/ypdigital](https://www.scoutingatl.org/ypdigital)  
45. Can BSA youth members discuss Scouting in private digital groups?, [https://onscouting.org/2021/09/14/can-bsa-youth-members-discuss-scouting-in-private-digital-groups/](https://onscouting.org/2021/09/14/can-bsa-youth-members-discuss-scouting-in-private-digital-groups/)  
46. Youth Protection \- Bucktail Council, [https://bucktail.org/training/youth-protection/](https://bucktail.org/training/youth-protection/)  
47. Youth Protection \- Palmetto Council, Scouting America, [https://www.palmettocouncil.org/youth-protection](https://www.palmettocouncil.org/youth-protection)  
48. Youth Protection and texting with Scouts \- On Scouting, [https://onscouting.org/2016/06/15/youth-protection-and-texting-with-scouts/](https://onscouting.org/2016/06/15/youth-protection-and-texting-with-scouts/)  
49. The BSA's "no one-on-one contact" rule and cyberspace \- On Scouting, [https://onscouting.org/2015/04/06/no-one-one-contact-provision-applies-digital-contact/](https://onscouting.org/2015/04/06/no-one-one-contact-provision-applies-digital-contact/)  
50. How to use the moderation API \- OpenAI Developers, [https://developers.openai.com/cookbook/examples/how\_to\_use\_moderation](https://developers.openai.com/cookbook/examples/how_to_use_moderation)  
51. Modern AI Integration: OpenAI API in Your Next.js App | by Adhithi Ravichandran | Medium, [https://adhithiravi.medium.com/modern-ai-integration-openai-api-in-your-next-js-app-f3a3ce2decf0](https://adhithiravi.medium.com/modern-ai-integration-openai-api-in-your-next-js-app-f3a3ce2decf0)  
52. Keeping Kids Safe | Evangeline Area Council | Scouting America, [https://www.eacscouting.org/KeepingKidsSafe](https://www.eacscouting.org/KeepingKidsSafe)  
53. An Honest Review of Google Antigravity \- DEV Community, [https://dev.to/fabianfrankwerner/an-honest-review-of-google-antigravity-4g6f](https://dev.to/fabianfrankwerner/an-honest-review-of-google-antigravity-4g6f)  
54. Agent Factory Recap: 100X engineering with AI agents in Google Antigravity 2.0, [https://cloud.google.com/blog/topics/developers-practitioners/agent-factory-recap-100x-engineering-with-ai-agents-in-google-antigravity-20](https://cloud.google.com/blog/topics/developers-practitioners/agent-factory-recap-100x-engineering-with-ai-agents-in-google-antigravity-20)  
55. GoogleChrome/modern-web-guidance-src \- GitHub, [https://github.com/GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src)  
56. Getting Started with Google Antigravity \- Codelabs, [https://codelabs.developers.google.com/getting-started-google-antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)  
57. Authoring Google Antigravity Skills \- Codelabs, [https://codelabs.developers.google.com/getting-started-with-antigravity-skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)  
58. 7 Best OpenAI Codex Alternatives for Developers (2026) \- Noumi, [https://noumi.ai/blog/openai-codex-alternatives](https://noumi.ai/blog/openai-codex-alternatives)  
59. I tested the top 5 OpenAI Codex alternatives in 2026 (Here's my verdict) | eesel AI, [https://www.eesel.ai/blog/openai-codex-alternatives](https://www.eesel.ai/blog/openai-codex-alternatives)  
60. How OpenAI uses Codex, [https://openai.com/business/guides-and-resources/how-openai-uses-codex/](https://openai.com/business/guides-and-resources/how-openai-uses-codex/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAaCAYAAAAzBZtTAAACuUlEQVR4Xu2Yz6tNURTHFymJ/IgMHkZSomTox4DeP2DyBjLwKGMZoBhJfowoRiZG5noZvF4pqVeSH5nIj8iEFEohJgbsr70X632tvc+59517cZxPrc7Z37X22vuse84++x6Rjo62MxJsJ4sZFgX7xmLLeBHsEIu9clliocaN9ihpC43GlIoLnzXmmFTHzIZX0lvu0lyuBVtNWm3OS0y4jB2BB/L7YMrVYLtZdNALPcWORC5/U1ySOMY6dhhuBDsn5bmUfFm8X4vxYjY7mgfuUuDlUOr8SP2yNx0x9lnrIFD80hwBfHNZLLFJYqcL7CC8gd85msendPRygP0sNAyWOYCxb1mH4WE6Iua6dRBYJqZYLIGEH1l08IqD9kXSPLTf9nT+0vgA520aze9dA7gZbEmwg+L7LfOkOuYnWG8RvIUdDt7k0N5IGrM12F3TzuUZJJr/jjm3TKbje/H9TJ2YH3yVesHLpf/CfJaZO5A1EvtBV+6Z80GwKx2xzeI5PzPn3jV6IGYHix69JIQdcPQqvBg77lrxdy4euhOosywp2B0pSyX235baeNyxh1f4h8+BuKMsevRaYMbTGO/u/CCx74ZgV8hXYlpiv9vsKMBzRFt3NfbdMyf5jhgtB+JOsuiRK5ylFJPTLStZSGjeOjlmA+dH+0mwxxKLqmB3wLE5EDfGogc2/aWkeLPCr1sYBr7SnvAEC4bnMvgC7wl2nzQd80xGrwPiSn9YZoBgngTQl9ECdhjgP8xiAutc1YThP81igyA/P/JeIXVtPk56Du5fRAupRV4V7GnSVmhQBsS8ZlF+XYQ1D+ilbxz9wmPb8XG+j9psJUalOqYxsNAPbbC/hC/B1rM4SN4GW8xiixn6DTU/2BsWW8p4sAkWhwG+VuHRaTPYO+Of7x+j6mvcv45+Eezo6Ojo6Pi/+Q75696x2ecn5AAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAAAq0lEQVR4XmNgGJFgIRD/R8PoAF3+Oao0JkBWLIgmBwPX0AVwAZiLcLkuGV0AH+iH0rgMe4QugAtYIbG3MUAMy0QSAwFsFmAFW5DYTAyYrpNA4+MF6ApnoYldB+JAJD5OYAPEZ9AFGSCGnUdiEwVAYYTNVmSv/kWWwAdw2QpyMUjuDhB7o8nhBLgMAwH0iMALZgDxfnRBJECUYXYMCIX4NLgw4JYbBaNgFDAAADy4Nh1Zpni1AAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAbCAYAAAB4Kn/lAAAA+klEQVR4XmNgGAV4wH80TAiQpD4ciPcxEFb4kgGi5h26BC5wFIibGPAbLADEHAwQNblocjgBSLE6lGZBkwMBZiC+AcSbGPBbjgJgrgABEO2GJAcDn6A0UeEKA5uBOAHKBmlajJACAx4kNkkGIysEsZ8i8WFiyOxnSHy8AF0jMv8DEluXASJngCSGFyxBYqMbnI/EXsFAQjCg245s8HdkCQaI+Hs0MZxgDRofZnAQEAdjkStCE8MJ0L12CCr2GU0clCHQ1WIFoCwMc10GEGtDxeOhYjCggCQGwk5A7IAkjwLsGBAKYbgXKifEAMldMICuDoZHwSgYBYMCAAD9blDh3lfWlgAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAaCAYAAABM1ImiAAAC2klEQVR4Xu2Yz6tOQRjHH1lQyI9wUezYKFF+dZXuwpaNKLKyEBZWfqyUslA26GZpIYqNv0CxoVj4sfFrY2UhhCglC+ZrZnof3/vMnDPn5aB3PvU0Z77PM9+Zd+57zp3zilQqlTKWuphgMcFsF99ZHFF+yz5cEm+0X2lPgjZXaUxucuR0MJy3avqgZA0HJV/P/SLOijdYyAnHfUmb33Cxj0WDV+I9MI9Fyr9Proi9scwnyddddrGVxTbkTCNWzSpDszgWWssjou/CUlKepcDnemhTXHCxRnzNdsppch4m0fQiJwhrE98amsWH0FoeYDcLhVieXYDP4dBaTHfx0sVVSddEmvJTwIDPLBpYm4j+JGkWcdzGcP1a5QD7ljLs+Mh5F7PE+62nHHgXWmsvGOzpCRZTLBBvuIUTBtbk6K8mjdng4pHqp3yGYdjxAHuxKFzD76jKgfnq2voMzEkX71lM8U2aDcEcsSfnvsVHF/NUf0z8uK+hv9PFs0G6E23W0cQddQ2/p6oPcHqMIH9b9S3GpWBd1uZaxFPCEdLbjLVq9Lxol6hcjolEwIM1RAl6nbwvODVGDonPzVCaRdG7FU+YIlVnaYx+LEXwrMXYdaFty81EwIM1xAo/rBHcsXoduDtiH18SeEXeqFyOadKu7iepDdbkalK6JvVtj76POdGBNuvI8dDFLtU/IANP5DTQb5FmsUkK1nVa8sXx9nrBiQByM1lU4B9WCjyDMV5vQFdyn6ENPH5l0HaQvjbo20i32CNTfbOg+AGLjmXiczjOpUD+OIuBzdK8kKZ8W4bxWSz2eGjXDM2qtbgrze9mv7BcvHl8luMP8DxoWGQO1MSztSYuWIdFSi+lqw+v8QzlInjr59qmOZHHe1MvnJLmBfXBv7AGpvc14RSBl6HKgL0u7rH4p8F52no8jTK93w0R/Gj3hcURBX8E3BF/jXMsjCD4dbbN0bZSqVQqlcr/wg9SDPBmJLzLoAAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAAZCAYAAAC4j5m6AAACRklEQVR4Xu2Xz6tNURTHF4UkIUqSeiM/ysDfYGRuIBNMTDGTiVLyL5iQgTLAgMJAlIFMKSMM3isxUgbCQGJ9O3vV6nv3j3Xe63buq/2pb+fs7173nO9Zb999zxPpdDqdSbnPRoaTqidsTsA1NjIsStYqH1X/2MyAmkjdPLkrsQyLkLXKNtVvaYe0B2nVzZv1lLXKX9VDaYe8I9M/zGfVRalneCqLkbXKT9VB1QOph7S5MQ/zRrWTzcRu1Ss2G7xXnVVdkHqGW+kYzbpZdcSND6s2ufFceJ2OtRW/rDqRzqMPY6B2B3n7kj+Wb+lYW/HIakSyWg30Ih2vOs/44TzobfK9dzt5TfyFS43H/n/cjTlQBGwPe9L5XtVLNxfljzsvNX61WUt18L6Qdyb5W9L4k5sLsUF1yY1LjWevFLIFPrM/HcdyQ/XYjUuNZy+atVSHV1H4u8i3+vOqDzRXZaPM3ijXeIyxitjjugjWdFv5Y/BNB7nGryUrfudydUdl8G/yhAz+CpstsBdZqJIAeyzshVFQjx8su3aUczJ7XxZgj1XLWmr8MRn8Rzwhw5sg5g7xxFh+Sf7mjH/YCAjG9RgvkTcG2wJaRLOWGm//qG0lH9521fd0vibsL9gi+jAAX9XrbCbuyfDathqeSyxDNKs1fsl5p5OHfdzzVXXAjd9J7B4z2OphMTwP1b6+IHcdT2ueuSyzGXLX4PlWVms8VvAz1ZU0xiukwdcDpwp+J0hpq+nMmb5aJ6I3fgJ4j8Y+3+l0Op1OZz3wH+jQ+3LIfQtZAAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,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>