# Distributed API Rate Limiter & Gateway Dashboard

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redis](https://img.shields.io/badge/Redis-Distributed_State-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A production-inspired distributed API Gateway implementing configurable
Load Balancing, Distributed Rate Limiting, Health Checking,
Reverse Proxying and a Real-Time Monitoring Dashboard.

Designed using modern distributed systems principles.

</div>

---

# Table of Contents

- Introduction
- Why This Project?
- Key Features
- Architecture Overview
- Technology Stack
- System Components
- Folder Structure
- Request Lifecycle
- Gateway Architecture
- Load Balancing Algorithms
- Distributed Rate Limiting
- Health Checker
- Backend Services
- Dashboard
- Redis Data Model
- Performance Metrics
- Testing
- Docker Deployment
- API Documentation
- Challenges
- Future Improvements
- Setup Guide
- License

---

# Introduction

Modern applications are rarely built as a single monolithic server.

Instead, production systems are composed of dozens or hundreds of
independent microservices deployed across multiple machines.

While this architecture improves scalability, maintainability,
and fault isolation, it introduces several infrastructure challenges:

- Routing incoming traffic
- Protecting backend services
- Preventing abuse
- Balancing requests
- Detecting unhealthy instances
- Monitoring traffic
- Managing distributed state

These responsibilities are typically handled by an API Gateway.

This project demonstrates the implementation of a production-inspired
API Gateway from scratch using Node.js, Redis, Express.js and React.

Unlike traditional university projects that simply proxy requests,
this gateway integrates multiple distributed systems concepts including:

- Reverse Proxy
- Redis-backed Distributed Rate Limiting
- Configurable Load Balancing
- Health Monitoring
- Real-Time Metrics Dashboard
- Dockerized Deployment
- Dynamic Routing

The objective of this project is to understand how systems like

- Kong
- Envoy
- AWS API Gateway
- NGINX
- HAProxy

work internally rather than relying on existing gateway software.

---

# Why This Project?

Traditional API Gateways such as Kong, NGINX or Envoy provide excellent
enterprise solutions.

However, many software engineers understand how to configure them
without understanding how they actually work internally.

This project was built to answer questions such as:

- How does a gateway decide which server should receive the next request?
- How is distributed rate limiting implemented?
- How can multiple gateway instances share rate limiting state?
- How do health checks prevent requests from reaching failed servers?
- How are different load balancing algorithms implemented?
- How does Redis enable horizontal scalability?
- How can an administrator dynamically configure routing behaviour?

Every major component has been implemented manually to provide a deeper
understanding of distributed backend engineering.

---

# Project Objectives

The project focuses on solving several real-world backend engineering problems.

## 1. Distributed Rate Limiting

Traditional in-memory counters fail when multiple gateway instances are deployed.

Example:

Gateway Instance A

```
User Requests = 50
```

Gateway Instance B

```
User Requests = 40
```

Actual Requests

```
90
```

Since each gateway maintains its own memory,
the global request count becomes inconsistent.

Redis centralizes this shared state allowing every gateway instance
to enforce identical limits.

---

## 2. Intelligent Request Routing

Instead of forwarding every request to a fixed backend,
the gateway dynamically selects the destination server using
configurable load balancing strategies.

Supported algorithms include:

- Round Robin
- Weighted Round Robin
- Least Connections
- Least Response Time
- Random
- IP Hash
- Consistent Hashing

Each algorithm solves a different routing problem
and can be switched dynamically.

---

## 3. Backend Health Monitoring

Sending traffic to unavailable servers significantly impacts
system reliability.

A background health checker continuously monitors every backend service.

Healthy servers remain available.

Unhealthy servers are automatically removed from the routing pool
until recovery.

---

## 4. Centralized Traffic Management

Rather than exposing every backend directly to clients,
all requests pass through the gateway.

```
Client

        │

        ▼

 API Gateway

        │

 ┌──────┼────────┐

 ▼      ▼        ▼

User   Auth   Payment

Service Service Service
```

This architecture allows:

- Authentication
- Logging
- Metrics
- Rate Limiting
- Request Validation
- Load Balancing

to remain centralized.

---

# Resume Highlights

This project demonstrates practical implementation of several
distributed systems concepts commonly discussed during
Software Engineering interviews.

Highlights include:

- Distributed Redis-backed Rate Limiter
- Reverse Proxy Architecture
- Seven Load Balancing Algorithms
- Real-Time Monitoring Dashboard
- Health Check Service
- Dockerized Multi-Service Deployment
- Dynamic Gateway Configuration
- Horizontal Scalability Support
- Redis-based Shared State
- Configurable Routing Policies

---

# Key Features

## API Gateway

- Reverse Proxy implementation
- Dynamic request forwarding
- Service routing
- Middleware pipeline
- Centralized traffic management

---

## Distributed Rate Limiter

- Redis-backed counters
- Distributed synchronization
- Configurable policies
- Dynamic limit updates
- Multiple algorithms

---

## Load Balancer

Supports multiple production-inspired routing algorithms.

- Round Robin
- Weighted Round Robin
- Least Connections
- Least Response Time
- Random
- IP Hash
- Consistent Hashing

---

## Monitoring Dashboard

Administrative dashboard built using React.

Provides:

- Request Analytics
- Live Metrics
- Blocked Requests
- Active Servers
- Algorithm Selection
- Gateway Configuration
- Traffic Monitoring
- Health Status

---

## Docker Support

Entire system can be deployed using Docker Compose.

Each service runs independently inside isolated containers,
closely resembling production deployment.

---

# High Level Architecture

```text
                    ┌──────────────────────┐
                    │       CLIENT         │
                    └──────────┬───────────┘
                               │
                               ▼
                 ┌─────────────────────────────┐
                 │       API GATEWAY           │
                 │                             │
                 │  Authentication             │
                 │  Logging                    │
                 │  Metrics                    │
                 │  Rate Limiting              │
                 │  Load Balancer              │
                 └──────────┬──────────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
   User Service       Auth Service        Product Service
        │                   │                    │
        └──────────────┬────┴────────────────────┘
                       ▼
                  Redis Cluster
```

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js |
| Backend | Node.js |
| Framework | Express.js |
| Distributed Cache | Redis |
| Containerization | Docker |
| API Communication | REST |
| Visualization | React Dashboard |
| State Sharing | Redis |
| Health Monitoring | Node Scheduler |
| Configuration | JSON |

---

# Design Principles

The architecture follows several software engineering principles.

## Separation of Concerns

Each module performs a single responsibility.

Examples:

Gateway

Handles routing only.

Rate Limiter

Handles request throttling only.

Load Balancer

Selects backend servers only.

Dashboard

Visualizes runtime metrics only.

Redis

Maintains distributed shared state.

This modular design improves maintainability,
testability,
and scalability.

---

**End of Part 1**

Next part will cover:

- Complete Folder Structure
- Detailed Architecture
- Request Lifecycle
- Gateway Internal Workflow
- Middleware Pipeline
- Configuration Management
- Service Discovery
- Redis Integration
- Sequence Diagrams


---

# Project Architecture

The project follows a modular microservice-inspired architecture where every
component has an independent responsibility.

Unlike a monolithic Express application, the gateway acts as the single
entry point while backend services remain completely isolated.

```text
                     Internet
                         │
                         │
                  HTTP Requests
                         │
                         ▼
              ┌──────────────────────┐
              │     API Gateway      │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────────┐
         │               │                   │
         ▼               ▼                   ▼
  Rate Limiter    Load Balancer      Request Logger
         │               │
         └───────┬───────┘
                 │
          Health Checker
                 │
                 ▼
      ┌─────────────────────┐
      │ Service Selection   │
      └─────────┬───────────┘
                │
     ┌──────────┼─────────────┐
     ▼          ▼             ▼
 User API   Auth API    Product API
     │          │             │
     └──────────┴─────────────┘
                │
                ▼
             Redis
```

The architecture intentionally separates infrastructure responsibilities
from business logic.

Every incoming request passes through a predictable pipeline where each
component contributes one responsibility before forwarding the request to
the appropriate backend.

---

# Folder Structure

The project is organized into independent modules following a layered
architecture.

```text
Distributed-API-Rate-Limiter-Gateway-Dashboard
│
├── gateway/
│   ├── config/
│   ├── middleware/
│   ├── loadBalancers/
│   ├── rateLimiters/
│   ├── health/
│   ├── routes/
│   ├── services/
│   ├── redis/
│   ├── utils/
│   └── server.js
│
├── dashboard/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── assets/
│   │
│   └── package.json
│
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── product-service/
│   └── ...
│
├── docker-compose.yml
├── README.md
└── package.json
```

The exact directory names may differ slightly depending on deployment,
however every module follows the same architectural principles.

---

# Folder Explanation

## Gateway

The gateway is the heart of the entire system.

Every request first arrives here.

Responsibilities include

- Request validation
- Reverse proxying
- Rate limiting
- Load balancing
- Logging
- Metrics collection
- Health verification
- Backend routing

Instead of clients communicating directly with backend services,
all traffic passes through this centralized layer.

Advantages include

- Improved security
- Centralized monitoring
- Dynamic routing
- Simplified deployments
- Infrastructure abstraction

---

## Load Balancer

This module contains all routing algorithms.

Instead of hardcoding a backend,
the gateway asks the load balancer
which server should receive the request.

```javascript
const server = strategy.selectServer(serviceName);

proxyRequest(server);
```

Responsibilities

- Select backend
- Skip unhealthy servers
- Track active connections
- Monitor latency
- Support algorithm switching

---

## Rate Limiter

Responsible for protecting backend services against

- Traffic spikes
- Abuse
- Bots
- Denial-of-Service attacks

Unlike local memory counters,
Redis stores the shared state,
allowing every gateway instance to enforce identical limits.

Example

```text
Gateway A
       │
       │
Gateway B
       │
       ▼
      Redis
```

Every gateway reads and writes the same Redis keys.

---

## Health Checker

A scheduled process periodically verifies
whether backend services are alive.

Example

```http
GET /health
```

Healthy response

```json
{
  "status": "UP"
}
```

Unhealthy servers are removed from
the routing pool until recovery.

---

## Dashboard

The dashboard provides administrators
with a real-time visualization
of gateway behaviour.

Capabilities include

- Active requests
- Request rate
- Response time
- Health status
- Blocked requests
- Load balancing algorithm
- Rate limiter configuration
- Backend availability

Rather than relying on command line logs,
administrators can inspect the gateway visually.

---

## Backend Services

Each backend service represents an independent microservice.

Examples

```
User Service

Authentication Service

Product Service

Order Service
```

The gateway treats every service equally.

Business logic never exists inside the gateway.

This separation allows backend services
to evolve independently.

---

## Redis

Redis acts as the distributed shared memory
for the entire gateway.

It stores

- Rate limiter state
- Active connections
- Response times
- Health information
- Gateway configuration
- Metrics
- Server counters

Because Redis resides outside the gateway,
multiple gateway instances share identical data.

---

# Detailed Request Lifecycle

Every request follows exactly the same pipeline.

```text
Client

   │

   ▼

Receive Request

   │

Authentication

   │

Logging

   │

Rate Limiter

   │

Load Balancer

   │

Health Checker

   │

Backend Selection

   │

Forward Request

   │

Receive Response

   │

Update Metrics

   │

Return Response
```

Each stage contributes one responsibility.

This modular design allows features
to be modified independently.

---

# Gateway Workflow

The gateway is implemented as a middleware pipeline.

Instead of writing one large function,
requests pass through multiple middleware components.

Conceptually

```javascript
app.use(authentication);

app.use(logging);

app.use(rateLimiter);

app.use(loadBalancer);

app.use(proxyMiddleware);
```

Advantages

- High maintainability
- Easy testing
- Independent modules
- Reusable middleware
- Better debugging

---

# Request Processing Pipeline

## Step 1

Client sends request.

```http
GET /users/profile
```

Gateway receives the request.

---

## Step 2

Request metadata is extracted.

Example

```text
IP Address

Headers

Method

Timestamp

Requested Service
```

These values are required
for rate limiting,
routing
and logging.

---

## Step 3

Rate limiter checks whether
the client has exceeded
the configured request quota.

Allowed

↓

Continue

Blocked

↓

HTTP 429

---

## Step 4

Gateway determines
which backend service
should process the request.

Example

```
/auth

↓

Authentication Service
```

```
/users

↓

User Service
```

```
/products

↓

Product Service
```

---

## Step 5

Load balancer selects
one healthy instance.

Example

```javascript
const backend =
loadBalancer.select(serviceName);
```

Selection depends on
the configured routing algorithm.

---

## Step 6

Gateway forwards the request.

```javascript
proxy.web(req,res,{
    target:backend.url
});
```

The client remains unaware
of the actual backend server.

---

## Step 7

Backend generates response.

Gateway measures

- Response time
- Success rate
- Status code

These metrics are pushed to Redis.

---

## Step 8

Dashboard receives updated metrics.

Administrators immediately observe

- Current traffic
- Failed requests
- Active servers
- Latency
- Health status

without restarting the application.

---

# Configuration Management

One important design goal was avoiding
hardcoded infrastructure.

Instead,
configuration files determine

- backend servers
- ports
- algorithms
- rate limits
- service mappings

Changing infrastructure therefore
does not require recompiling
the application.

Typical configuration

```json
{
  "algorithm":"leastConnections",
  "rateLimiter":"tokenBucket",
  "window":60000,
  "capacity":100
}
```

This makes experimentation
extremely simple.

---

# Why Redis?

Redis was selected because it provides

- extremely low latency
- atomic operations
- expiration support
- distributed synchronization
- high throughput

Using Redis prevents one gateway
from having different rate limiting
information than another gateway.

Without Redis

```
Gateway A

100 Requests
```

```
Gateway B

95 Requests
```

No synchronization exists.

With Redis

```
Gateway A

↓

Gateway B

↓

Redis Counter

195 Requests
```

Every instance observes identical state.

---

**End of Part 2**

**Part 3** will cover the complete **Load Balancer implementation**, including every routing algorithm (Round Robin, Weighted Round Robin, Least Connections, Least Response Time, Random, IP Hash, Consistent Hashing), mathematical intuition, complexity analysis, advantages, disadvantages, and implementation snippets extracted in a production-style explanation.



---

# Load Balancer

## Overview

One of the most important responsibilities of an API Gateway is deciding **where**
an incoming request should be forwarded.

If every request is routed to the same server, several issues quickly arise:

- One server becomes overloaded.
- Other servers remain underutilized.
- Response time increases dramatically.
- Hardware resources are wasted.
- A single server failure can bring down the entire application.

A **Load Balancer** solves this problem by intelligently distributing requests
across multiple backend instances.

Unlike cloud providers that hide these implementation details,
this project implements every routing strategy manually to demonstrate
how production systems make routing decisions.

---

# Why Load Balancing?

Consider three backend servers.

```text
               API Gateway
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
     Server A    Server B    Server C
```

Suppose 9,000 requests arrive.

Without a Load Balancer:

```text
Server A

9000 Requests

Server B

0

Server C

0
```

CPU utilization

```
A : 100%

B : 0%

C : 0%
```

Average response time increases rapidly.

---

With a Load Balancer:

```text
Server A

3000

Server B

3000

Server C

3000
```

CPU utilization

```
A : 34%

B : 33%

C : 33%
```

The workload becomes evenly distributed.

Benefits include

- Better resource utilization
- Reduced latency
- Increased throughput
- Fault tolerance
- Horizontal scalability
- Improved availability

---

# Load Balancer Responsibilities

The Load Balancer module is responsible for:

- Selecting backend servers.
- Ignoring unhealthy instances.
- Tracking request distribution.
- Supporting multiple routing algorithms.
- Switching algorithms dynamically.
- Updating runtime metrics.

Rather than hardcoding a destination,
the Gateway delegates routing to the Load Balancer.

Example

```javascript
const backend =
loadBalancer.selectServer(serviceName);

proxy.web(req, res, {
    target: backend.url
});
```

This separation makes routing strategies interchangeable
without modifying gateway logic.

---

# Load Balancer Workflow

```text
Incoming Request
        │
        ▼
Identify Target Service
        │
        ▼
Retrieve Healthy Servers
        │
        ▼
Execute Routing Algorithm
        │
        ▼
Return Selected Backend
        │
        ▼
Forward Request
```

Every algorithm shares the same interface.

```javascript
class LoadBalancer{
    selectServer(serviceName){
        ...
    }
}
```

Only the selection logic changes.

---

# Server Metadata

Every backend server maintains runtime metadata.

Example

```javascript
{
    id: "user-service-1",

    url: "http://localhost:5001",

    healthy: true,

    activeConnections: 12,

    averageResponseTime: 42,

    weight: 3
}
```

Different algorithms use different fields.

| Algorithm | Uses |
|------------|---------------------------|
| Round Robin | Current Index |
| Weighted RR | Weight |
| Least Connections | Active Connections |
| Least Response | Average Response Time |
| IP Hash | Client IP |
| Consistent Hash | Hash Ring |
| Random | Healthy Servers |

---

# Round Robin

## Overview

Round Robin is one of the simplest
and most widely used load balancing algorithms.

Requests are assigned sequentially.

Example

```text
Request 1

↓

Server A

Request 2

↓

Server B

Request 3

↓

Server C

Request 4

↓

Server A
```

The cycle repeats indefinitely.

---

## Algorithm

Maintain a pointer.

```text
Index = 0
```

Every request

```text
Server = Servers[Index]

Index++

Index %= NumberOfServers
```

---

## Example

Servers

```text
A

B

C
```

Requests

```text
R1 → A

R2 → B

R3 → C

R4 → A

R5 → B

R6 → C
```

Distribution remains balanced.

---

## Implementation

```javascript
class RoundRobin {

    constructor(servers){
        this.servers = servers;
        this.index = 0;
    }

    next(){

        const server =
            this.servers[
                this.index %
                this.servers.length
            ];

        this.index++;

        return server;
    }

}
```

---

## Complexity

Selection

```
O(1)
```

Memory

```
O(1)
```

---

## Advantages

- Extremely fast
- Constant time
- Very simple
- Fair distribution
- No runtime statistics required

---

## Limitations

Every server receives
the same number of requests.

It assumes

- equal hardware
- equal CPU
- equal memory
- equal network

Real production systems rarely satisfy these assumptions.

---

# Weighted Round Robin

## Motivation

Suppose

```
Server A

32 CPU Cores

Server B

8 CPU Cores
```

Simple Round Robin

```
50%

50%
```

is inefficient.

Server A can process significantly more traffic.

Weighted Round Robin solves this problem.

---

## Example

Weights

```
Server A = 3

Server B = 2

Server C = 1
```

Distribution

```text
A

A

A

B

B

C

Repeat
```

Traffic ratio

```
3 : 2 : 1
```

---

## Implementation Idea

Expand the server list
according to weight.

```javascript
[
A,A,A,
B,B,
C
]
```

Then perform standard
Round Robin.

Another implementation
uses cumulative weights
without expanding arrays.

---

## Complexity

Selection

```
O(1)
```

Expanded version memory

```
O(totalWeight)
```

Optimized version

```
O(1)
```

---

## Advantages

- Supports heterogeneous hardware.
- Better resource utilization.
- Fair proportional distribution.
- Production friendly.

---

## Drawbacks

Weights must be tuned.

Incorrect weights
may overload weaker machines.

---

# Random Load Balancing

## Overview

Random routing simply chooses
one healthy backend
uniformly at random.

Example

```
Request 1

↓

Server B
```

```
Request 2

↓

Server A
```

```
Request 3

↓

Server C
```

No history is maintained.

---

## Implementation

```javascript
const index =
Math.floor(
Math.random() *
healthyServers.length
);

return healthyServers[index];
```

---

## Complexity

Selection

```
O(1)
```

Memory

```
O(1)
```

---

## Advantages

- Extremely lightweight
- No counters
- No synchronization
- Very simple

---

## Disadvantages

Distribution is probabilistic.

Small request batches
may appear imbalanced.

Large traffic volumes
naturally converge
towards uniform distribution.

---

# Health-Aware Routing

Every routing algorithm first filters
unhealthy instances.

```javascript
const healthyServers =
servers.filter(
server => server.healthy
);
```

Selection occurs only among
healthy backends.

Example

```text
Server A

Healthy

✓
```

```text
Server B

Unhealthy

✗
```

```text
Server C

Healthy

✓
```

Round Robin therefore becomes

```
A

C

A

C
```

rather than

```
A

B

C
```

This significantly improves
system reliability.

---

# Runtime Metrics

The Load Balancer continuously updates
runtime statistics.

Examples include

- Active Connections
- Average Response Time
- Successful Requests
- Failed Requests
- Server Utilization
- Last Health Check
- Request Count

These metrics power
the real-time React dashboard,
allowing administrators to observe
traffic distribution live.

---

**End of Part 3**

**Part 4** will cover the remaining production-grade routing algorithms:

- Least Connections
- Least Response Time
- IP Hash
- Consistent Hashing (with hash ring diagrams)
- Dynamic Algorithm Switching
- Health Checker Architecture
- Failure Recovery
- Comparative Analysis of all Algorithms
- Time & Space Complexity Table
- Best Use Cases for Each Strategy



---

# Least Connections Load Balancing

## Overview

While Round Robin assumes every request requires approximately the same amount
of work, this assumption rarely holds true in real-world systems.

Consider the following example:

```
Request A

Generate Monthly Report

Execution Time

12 seconds
```

```
Request B

Fetch User Profile

Execution Time

25 milliseconds
```

Using Round Robin, both requests are treated equally despite having vastly
different processing costs.

As traffic grows, some servers may still be processing long-running requests
while others remain mostly idle.

Least Connections solves this problem by selecting the backend currently
handling the fewest active requests.

---

## Working Principle

Each backend maintains a counter representing the number of active requests.

```text
Server A

Connections = 18
```

```text
Server B

Connections = 6
```

```text
Server C

Connections = 11
```

Incoming request

↓

Gateway selects

↓

Server B

because it currently has the smallest workload.

---

## Request Lifecycle

When a request starts

```javascript
server.activeConnections++;
```

When the response finishes

```javascript
server.activeConnections--;
```

Selection simply becomes

```javascript
const server = servers.reduce((best,current)=>{

    return current.activeConnections <
           best.activeConnections
           ? current
           : best;

});
```

---

## Example

Current state

```
Server A

25 Requests
```

```
Server B

12 Requests
```

```
Server C

18 Requests
```

Incoming request

↓

Assigned to

```
Server B
```

After completion

```
Server B

13 Requests
```

The gateway continuously updates these counters.

---

## Time Complexity

Selection

```
O(n)
```

where

```
n = healthy servers
```

Memory

```
O(1)
```

---

## Advantages

- Better than Round Robin for uneven workloads.
- Prevents overloaded servers.
- Excellent for long-running APIs.
- Adapts dynamically to traffic.

---

## Disadvantages

Requires continuously tracking active requests.

---

# Least Response Time

## Overview

Least Connections considers only the number of active requests.

However, two servers may have identical connection counts while exhibiting
very different response times.

Example

```
Server A

Average Response Time

18 ms
```

```
Server B

Average Response Time

160 ms
```

Although both may have

```
10 Active Connections
```

Server A clearly provides faster responses.

Least Response Time chooses the backend with the lowest observed latency.

---

## Response Time Tracking

After every request completes

```javascript
const duration =
Date.now() - startTime;

server.averageResponseTime =
updateAverage(duration);
```

The average may be computed using

- Sliding Average
- Exponential Moving Average
- Simple Average

depending on implementation.

---

## Selection

```javascript
const server =
healthyServers.reduce((best,current)=>{

    return current.averageResponseTime <
           best.averageResponseTime
           ? current
           : best;

});
```

---

## Example

```
Server A

22 ms
```

```
Server B

81 ms
```

```
Server C

36 ms
```

Gateway selects

```
Server A
```

---

## Advantages

- Excellent user experience.
- Routes around slow servers.
- Automatically adapts to workload changes.

---

## Disadvantages

Requires runtime statistics.

Latency measurements must remain up to date.

---

# IP Hash Load Balancing

## Motivation

Certain applications require a user to consistently reach the same backend.

Examples include

- Shopping carts
- Temporary sessions
- In-memory caches
- Multiplayer games
- Legacy session storage

Round Robin cannot guarantee this behaviour.

---

## Sticky Routing

Instead of rotating requests,
the gateway hashes the client's IP address.

```
Client IP

↓

Hash Function

↓

Backend Server
```

The same client consistently maps to the same backend.

---

## Example

```
192.168.1.10

↓

Hash

↓

Server B
```

Every future request from

```
192.168.1.10
```

will continue reaching

```
Server B
```

until topology changes.

---

## Implementation

```javascript
const hash =
hashFunction(clientIP);

const index =
hash % healthyServers.length;

return healthyServers[index];
```

---

## Complexity

Selection

```
O(1)
```

Memory

```
O(1)
```

---

## Advantages

- Session affinity.
- Cache locality.
- Predictable routing.

---

## Limitations

Uneven IP distributions
can create server imbalance.

---

# Consistent Hashing

## Why Consistent Hashing?

Traditional hashing suffers from a major problem.

Suppose

```
hash(key) % numberOfServers
```

Servers

```
A

B

C
```

Now a fourth server is added.

```
A

B

C

D
```

Every modulo value changes.

Nearly every cached object
must move.

This causes massive cache misses.

---

Consistent Hashing minimizes redistribution.

Only a small fraction
of keys move.

---

# Hash Ring

Instead of using modulo,
servers are arranged on a circular ring.

```text
               Server A

          /                 \

 Server D                     Server B

          \                 /

               Server C
```

Every request key is hashed
onto the ring.

Traversal proceeds clockwise
until the nearest server is found.

---

## Example

```
User ID

↓

SHA-256

↓

Hash Ring

↓

Nearest Server
```

Adding a new server

```
Server E
```

affects only neighbouring keys.

Most existing mappings remain unchanged.

---

## Simplified Algorithm

```javascript
const hash = hashFunction(key);

for(const server of ring){

    if(server.hash >= hash){

        return server;

    }

}

return ring[0];
```

---

## Complexity

Hash lookup

```
O(log n)
```

when the ring is sorted.

Memory

```
O(n)
```

---

## Advantages

- Excellent cache locality.
- Minimal redistribution.
- Ideal for distributed caches.
- Used by systems such as DynamoDB,
  Cassandra and Redis Cluster.

---

## Drawbacks

More complex implementation.

Requires careful ring management.

---

# Dynamic Algorithm Switching

One major objective of the project
was avoiding hardcoded routing behaviour.

Instead, administrators can change
the routing strategy at runtime.

Example configuration

```json
{
    "loadBalancer": {
        "algorithm": "leastConnections"
    }
}
```

The gateway loads the configured strategy
and routes requests accordingly.

Conceptually

```javascript
switch(strategy){

case "roundRobin":

    return roundRobin.next();

case "leastConnections":

    return leastConnections.next();

case "leastResponseTime":

    return leastResponse.next();

case "ipHash":

    return ipHash.next(ip);

case "consistentHash":

    return consistentHash.next(key);

default:

    return random.next();

}
```

No gateway restart is required.

---

# Health Checker

## Purpose

Routing requests to unhealthy servers
causes

- increased latency
- connection failures
- poor user experience
- unnecessary retries

The Health Checker continuously monitors
backend availability.

Only healthy servers participate
in routing decisions.

---

## Health Check Workflow

```text
Timer

↓

Iterate Servers

↓

Send /health Request

↓

Response Received?

↓

Yes

↓

Mark Healthy

↓

No

↓

Mark Unhealthy

↓

Remove From Routing Pool
```

---

## Typical Endpoint

```http
GET /health
```

Healthy response

```json
{
    "status":"UP"
}
```

---

## Scheduler

Health checks execute periodically.

Conceptually

```javascript
setInterval(async()=>{

    await healthChecker.check();

},5000);
```

Every five seconds

- ping backend
- update status
- notify load balancer

---

## Failure Recovery

Suppose

```
Server B
```

crashes.

The next health check fails.

Gateway updates

```javascript
server.healthy = false;
```

Immediately afterwards

every routing algorithm ignores
that backend.

Once recovery succeeds

```javascript
server.healthy = true;
```

the server automatically rejoins
the routing pool.

No manual intervention is required.

---

# Comparison of Routing Algorithms

| Algorithm | Complexity | Dynamic | Sticky Sessions | Best Use Case |
|------------|-----------|----------------|----------------|----------------|
| Round Robin | O(1) | No | No | Equal hardware |
| Weighted Round Robin | O(1) | Partial | No | Unequal hardware |
| Random | O(1) | No | No | Small clusters |
| Least Connections | O(n) | Yes | No | Long-running APIs |
| Least Response Time | O(n) | Yes | No | Low latency systems |
| IP Hash | O(1) | Partial | Yes | Session persistence |
| Consistent Hashing | O(log n) | Yes | Cache locality |

---

The gateway architecture intentionally exposes multiple routing algorithms
because no single strategy performs optimally for every workload.

Production API gateways often support similar configurability, allowing
operators to choose the routing policy that best matches their application's
traffic characteristics.

---

**End of Part 4**

**Part 5** will cover the complete **Distributed Rate Limiter**, including:

- Token Bucket
- Sliding Window
- Redis Data Structures
- Redis Key Design
- Atomic Operations
- Horizontal Scaling
- Request Flow
- Dashboard Architecture
- Metrics Collection
- API Design
- Code snippets from the implementation



---

# Distributed Rate Limiter

## Overview

One of the primary responsibilities of an API Gateway is protecting backend
services from excessive traffic.

Without proper request throttling, even a small number of malicious or
misconfigured clients can overwhelm backend services, leading to increased
latency, resource exhaustion, and potential denial-of-service conditions.

This project implements a **Redis-backed Distributed Rate Limiter** designed
to support multiple gateway instances while maintaining a single, consistent
view of request quotas.

Unlike traditional in-memory rate limiters, every gateway instance shares
its state through Redis, making the solution horizontally scalable and
production-oriented.

---

# Why Rate Limiting?

Imagine a public REST API.

```text
                 Internet

        10,000 Requests / Second

                 │

                 ▼

            API Gateway

                 │

                 ▼

           Backend Services
```

Without any restrictions,

- A single client can consume all available resources.
- Genuine users experience slower responses.
- CPU utilization reaches 100%.
- Database connections become saturated.
- Cascading failures occur across dependent services.

Rate limiting prevents these situations by controlling the number of requests
a client may perform within a specified period.

---

# Why In-Memory Rate Limiting Fails

Many beginner implementations maintain counters inside application memory.

Example

```javascript
const requests = {};

requests[ip]++;
```

Although simple, this approach completely fails when multiple gateway
instances are deployed.

Consider two gateway instances.

```text
           Client

        100 Requests

              │

      ┌───────┴────────┐

      ▼                ▼

 Gateway A        Gateway B

      │                │

  Counter=50      Counter=50
```

Each gateway believes the client has only made **50 requests**.

Actual traffic

```
100 Requests
```

The request limit is never enforced correctly.

---

# Redis-Based Distributed State

Instead of storing counters locally, every gateway communicates with Redis.

```text
                  Client

                     │

                     ▼

              Gateway Instance A

                     │

                     ▼

                 Redis Server

                     ▲

                     │

              Gateway Instance B
```

All gateways read and update the same Redis keys.

This guarantees

- Consistent counters
- Accurate quotas
- Horizontal scalability
- Centralized state
- Atomic updates

---

# Why Redis?

Redis was selected because it offers

- In-memory performance
- Atomic operations
- Built-in expiration
- High throughput
- Persistence options
- Excellent Node.js support

Typical latency

```
< 1 ms
```

making it suitable for request processing pipelines.

---

# Rate Limiting Workflow

Every incoming request follows the same sequence.

```text
Incoming Request

        │

        ▼

Extract Client Identifier

        │

        ▼

Generate Redis Key

        │

        ▼

Read Current State

        │

        ▼

Apply Algorithm

        │

        ▼

Allow ?

      /     \

    Yes      No

    │         │

Forward     HTTP 429
Request
```

The algorithm determines whether the request should proceed or be rejected.

---

# Client Identification

The gateway identifies clients using values such as

- IP Address
- User ID
- API Key
- Authentication Token

Example

```text
192.168.0.15
```

Generated Redis key

```text
rate:192.168.0.15
```

Authenticated applications may instead use

```text
rate:user:1024
```

This allows different quotas for different users.

---

# Redis Key Design

A clean key structure improves maintainability and observability.

Example

```text
rate:user:145
```

```text
rate:free:192.168.1.20
```

```text
rate:premium:203.0.113.4
```

Additional keys used by the gateway may include

```text
gateway:metrics
```

```text
gateway:blocked
```

```text
server:user-service
```

```text
health:auth-service
```

Organizing keys consistently simplifies debugging and dashboard visualization.

---

# Token Bucket Algorithm

## Motivation

Applications often allow short bursts of traffic while preventing sustained abuse.

Example

A client may send

```
10 Requests
```

immediately

but should not continue indefinitely.

Token Bucket naturally supports this behavior.

---

## Concept

Imagine every client owns a bucket.

```text
Capacity

100 Tokens
```

Each request consumes one token.

```
Bucket

100

↓

99

↓

98

↓

97
```

Tokens are gradually replenished over time.

When no tokens remain,

the request is rejected.

---

# Token Bucket Workflow

```text
Incoming Request

        │

Read Token Count

        │

Replenish Tokens

        │

Token Available ?

     /           \

   Yes            No

    │              │

Consume Token   HTTP 429
```

---

## Example

Bucket Capacity

```
10
```

Refill Rate

```
2 Tokens / Second
```

Client sends

```
7 Requests
```

Remaining

```
3 Tokens
```

After one second

```
5 Tokens
```

After another second

```
7 Tokens
```

Traffic naturally stabilizes.

---

## Simplified Implementation

```javascript
if(bucket.tokens > 0){

    bucket.tokens--;

    allow();

}
else{

    reject();

}
```

The actual implementation also updates refill timestamps using Redis.

---

## Advantages

- Allows traffic bursts.
- Smooth recovery.
- Predictable behavior.
- Excellent for REST APIs.

---

## Complexity

Time

```
O(1)
```

Memory

```
O(1)
```

per client.

---

# Sliding Window Algorithm

## Motivation

Fixed windows suffer from boundary problems.

Example

Limit

```
100 Requests
```

Window

```
1 Minute
```

Client sends

```
100 Requests

at 12:00:59
```

Immediately afterwards

```
100 Requests

at 12:01:01
```

Total

```
200 Requests

within two seconds
```

The client bypasses the intended limit.

Sliding Window eliminates this issue.

---

# Working Principle

Instead of resetting counters every minute,

the algorithm continuously evaluates requests
within the previous time interval.

Example

```
Current Time

↓

Look Back

60 Seconds

↓

Count Requests

↓

Decision
```

The window "slides" forward with time.

---

## Redis Storage

Redis maintains request timestamps.

Example

```text
1657829123

1657829128

1657829131

1657829134
```

Older timestamps automatically expire
or are removed during evaluation.

---

## Simplified Logic

```javascript
removeExpiredEntries();

countRequests();

if(count < limit){

    allow();

}
else{

    reject();

}
```

---

## Advantages

- Accurate limiting.
- No boundary spikes.
- Fair request distribution.
- Widely used in production APIs.

---

## Complexity

Time

```
O(log n)
```

or

```
O(n)
```

depending on the Redis data structure.

Memory depends on the number of timestamps retained.

---

# Redis Atomic Operations

A distributed system must avoid race conditions.

Consider two gateways simultaneously processing requests.

Without atomic updates

```
Gateway A

Read 99
```

```
Gateway B

Read 99
```

Both increment independently.

Final value

```
100
```

Expected

```
101
```

One update is lost.

Redis atomic commands prevent this issue.

Examples

```text
INCR
```

```text
DECR
```

```text
EXPIRE
```

Every gateway observes the same consistent value.

---

# Horizontal Scalability

The gateway is designed to support multiple instances.

```text
                Internet

                    │

        ┌───────────┼────────────┐

        ▼           ▼            ▼

 Gateway 1     Gateway 2    Gateway 3

        │           │            │

        └───────────┼────────────┘

                    ▼

                 Redis
```

Regardless of which gateway receives the request,

the client always shares the same rate limit.

This architecture eliminates one of the biggest weaknesses of
traditional in-memory implementations.

---

# HTTP Responses

Successful request

```http
HTTP/1.1 200 OK
```

Blocked request

```http
HTTP/1.1 429 Too Many Requests
```

Typical response

```json
{
    "success": false,
    "message": "Rate limit exceeded",
    "retryAfter": 18
}
```

Returning meaningful metadata allows clients to retry intelligently.

---

# Metrics Collected

The gateway continuously records

- Total Requests
- Allowed Requests
- Blocked Requests
- Requests per Second
- Active Clients
- Average Response Time
- Rate Limit Violations
- Gateway Throughput

These metrics are exposed to the React dashboard for real-time visualization.

---

# Why This Design?

Compared to a traditional in-memory implementation, this architecture offers:

| Feature | In-Memory | Redis Distributed |
|---------|-----------|-------------------|
| Multiple Gateway Support | ❌ | ✅ |
| Shared State | ❌ | ✅ |
| Horizontal Scaling | ❌ | ✅ |
| Consistent Limits | ❌ | ✅ |
| High Availability | Limited | Excellent |
| Production Ready | No | Yes |

The Redis-backed implementation provides a strong foundation for scalable,
distributed API gateways and closely resembles techniques used in production
systems.

---

**End of Part 5**

**Part 6 (Final Part)** will include:

- React Dashboard Architecture
- API Endpoints
- Docker Deployment
- Environment Variables
- Testing & Benchmarking
- Performance Metrics (matching your resume)
- Challenges Faced
- Design Decisions
- Future Improvements
- Setup Instructions
- Contributing
- License
- Final Conclusion

This will complete the full README.



---

# React Dashboard

## Overview

A production gateway is incomplete without visibility into system behavior.

While logs provide historical information, administrators require a real-time
view of gateway health, traffic distribution, backend availability, and
performance metrics.

This project includes a modern React-based dashboard that communicates with
the gateway and visualizes infrastructure metrics in real time.

The dashboard is designed with operational monitoring in mind rather than
simple CRUD interfaces.

---

# Dashboard Objectives

The dashboard provides administrators with the ability to

- Monitor live traffic
- View request throughput
- Inspect backend health
- Observe load balancing distribution
- Detect blocked requests
- Configure gateway behavior
- Monitor Redis-backed metrics
- Analyze response latency

Instead of relying solely on terminal logs, infrastructure can be monitored
through an intuitive graphical interface.

---

# Dashboard Pages

The frontend is organized into modular pages.

## Dashboard

Displays

- Total Requests
- Successful Requests
- Failed Requests
- Blocked Requests
- Average Response Time
- Requests Per Second
- Active Services
- Gateway Status

---

## Architecture

Visual representation of the entire system.

Displays

- Client
- API Gateway
- Rate Limiter
- Load Balancer
- Redis
- Backend Services

Animated request flow illustrates how requests traverse the system.

---

## Load Balancer

Allows administrators to

- View active routing strategy
- Switch routing algorithms
- Monitor request distribution
- Observe server utilization
- Inspect backend response times

---

## Rate Limiter

Provides

- Current algorithm
- Request quotas
- Remaining tokens
- Window size
- Blocked requests
- Per-user statistics

---

## Services

Displays

- Running services
- Ports
- Health status
- Uptime
- Active connections
- Response latency

---

## Logs

Centralized visualization of

- Incoming requests
- Response codes
- Gateway events
- Rate limit violations
- Health check failures

---

# Metrics Collection

The gateway continuously records operational statistics.

Examples include

```text
Total Requests

Successful Requests

Failed Requests

Blocked Requests

Average Response Time

Peak Throughput

Backend Health

Load Distribution

Gateway Uptime
```

These values are periodically synchronized with the dashboard.

---

# API Design

The gateway exposes REST endpoints used by the dashboard.

Typical endpoints include

```http
GET /metrics
```

Returns gateway metrics.

---

```http
GET /health
```

Returns gateway health information.

---

```http
GET /services
```

Returns backend status.

---

```http
POST /config/load-balancer
```

Updates the routing algorithm.

---

```http
POST /config/rate-limiter
```

Updates the active rate limiting strategy.

---

# Docker Deployment

The entire system is containerized using Docker Compose.

A typical deployment consists of

```text
React Dashboard

↓

Gateway

↓

Redis

↓

Backend Services
```

Each service executes inside an isolated container.

Advantages

- Reproducible environments
- Easy local setup
- Simplified deployment
- Independent scaling
- Better dependency isolation

---

# Deployment Architecture

```text
                    Docker Network

      ┌─────────────────────────────────────┐

      │                                     │

      │    React Dashboard                  │

      │             │                       │

      │             ▼                       │

      │        API Gateway                  │

      │      ┌──────┼───────────┐           │

      │      ▼      ▼           ▼           │

      │ User   Auth   Product Service       │

      │             │                       │

      │             ▼                       │

      │           Redis                     │

      │                                     │

      └─────────────────────────────────────┘
```

---

# Environment Variables

Typical configuration

```env
PORT=3000

REDIS_HOST=redis

REDIS_PORT=6379

NODE_ENV=development

LOAD_BALANCER=leastConnections

RATE_LIMITER=tokenBucket
```

Using environment variables avoids hardcoding deployment-specific values.

---

# Local Setup

Clone the repository

```bash
git clone <repository-url>
```

Navigate into the project

```bash
cd Distributed-API-Rate-Limiter-Gateway-Dashboard
```

Install dependencies

```bash
npm install
```

Start Redis

```bash
docker compose up redis
```

Start backend services

```bash
npm run dev
```

Start the dashboard

```bash
cd dashboard

npm install

npm run dev
```

---

# Docker Setup

Build all containers

```bash
docker compose build
```

Start the complete system

```bash
docker compose up
```

Detached mode

```bash
docker compose up -d
```

Stop services

```bash
docker compose down
```

---

# Testing Strategy

The project was validated using several testing approaches.

## Functional Testing

Verified

- Gateway routing
- Service discovery
- Request forwarding
- API correctness

---

## Rate Limiter Testing

Validated

- Request quotas
- Token replenishment
- Sliding window behavior
- HTTP 429 responses
- Distributed synchronization

---

## Load Balancer Testing

Verified

- Round Robin distribution
- Weighted routing
- Least Connections
- Least Response Time
- Random routing
- Sticky sessions
- Consistent hashing

---

## Health Checker Testing

Simulated

- Server failures
- Recovery
- Dynamic routing updates
- Removal of unhealthy nodes

---

## Dashboard Testing

Verified

- Live metrics
- Configuration updates
- Health visualization
- Request analytics

---

# Performance Highlights

The project demonstrates practical implementation of distributed systems
concepts rather than focusing solely on API development.

Key engineering highlights include

- Distributed Redis-backed rate limiting
- Horizontal scalability support
- Configurable routing strategies
- Dynamic health-aware request forwarding
- Real-time operational dashboard
- Dockerized multi-service architecture
- Modular gateway design

These concepts closely align with production API gateway architectures used
in enterprise environments.

---

# Challenges Faced

## Distributed State Synchronization

Maintaining a consistent rate limit across multiple gateway instances
required external shared storage.

Redis solved this by providing atomic operations and centralized state.

---

## Dynamic Routing

Supporting multiple routing algorithms without modifying gateway logic
required a strategy-based architecture.

Each routing algorithm implements a common interface,
allowing runtime switching.

---

## Fault Tolerance

Routing traffic toward unavailable services leads to unnecessary failures.

Continuous health monitoring ensures only healthy backends receive traffic.

---

## Real-Time Monitoring

Collecting infrastructure metrics while minimizing gateway overhead required
careful separation of operational monitoring from request processing.

---

# Design Decisions

Several architectural decisions were made to maximize modularity.

### Gateway

Responsible only for infrastructure concerns.

### Backend Services

Contain business logic only.

### Redis

Acts as centralized distributed memory.

### Dashboard

Consumes metrics without affecting request processing.

### Load Balancer

Implements interchangeable routing strategies.

### Rate Limiter

Protects backend services independently of routing.

This separation follows the Single Responsibility Principle and simplifies
future extension.

---

# Future Improvements

Potential enhancements include

- Circuit Breaker Pattern
- Retry Policies
- Service Discovery
- Kubernetes Deployment
- Prometheus Integration
- Grafana Dashboards
- Distributed Tracing
- OpenTelemetry
- JWT Authentication
- Role-Based Access Control
- API Versioning
- Request Caching
- WebSocket Support
- gRPC Routing
- TLS Termination
- Auto Scaling
- Distributed Configuration Service
- Canary Deployments
- Blue-Green Deployment
- Multi-Region Support

---

# Learning Outcomes

This project provided hands-on experience with

- Distributed Systems
- Reverse Proxy Architecture
- Redis
- Load Balancing
- Rate Limiting
- Microservice Communication
- Health Monitoring
- Docker
- Express.js
- React
- Infrastructure Design
- System Design Principles

Beyond implementation, the project demonstrates how production gateways
coordinate multiple infrastructure responsibilities while remaining modular,
scalable, and maintainable.

---

# Contributing

Contributions are welcome.

To contribute

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

Suggestions, bug reports, and feature requests are encouraged.

---

# License

This project is licensed under the MIT License.

You are free to use, modify, and distribute the project in accordance with
the terms of the license.

---

# Author

**Roshan Adhav**

Software Engineering Intern | Distributed Systems | Backend Engineering |
System Design | Node.js | Redis | React

GitHub: https://github.com/roshanadhav

LinkedIn: https://linkedin.com/in/roshanadhav

Portfolio: coming soon

---

# Conclusion

The **Distributed API Rate Limiter & Gateway Dashboard** is a production-inspired
engineering project built to explore the internal architecture of modern API
gateways.

Rather than relying on existing gateway solutions, this project implements
core infrastructure components from first principles, including reverse
proxying, distributed rate limiting, configurable load balancing, health
checking, centralized request routing, and real-time operational monitoring.

By combining Node.js, Express.js, Redis, React, and Docker into a modular,
service-oriented architecture, the project demonstrates practical application
of distributed systems concepts commonly encountered in large-scale backend
engineering.

The implementation emphasizes extensibility, scalability, and maintainability,
making it both an educational resource and a strong portfolio project for
software engineering interviews focused on backend development and system
design.

---

## Acknowledgements

This project draws inspiration from the architectural principles employed by
modern API gateway and distributed systems platforms, including:

- Kong Gateway
- NGINX
- Envoy Proxy
- HAProxy
- AWS API Gateway
- Redis
- Netflix OSS
- Google SRE Practices

Their publicly documented designs and engineering approaches influenced the
overall architecture while the implementation presented here was developed
independently for educational and learning purposes.
