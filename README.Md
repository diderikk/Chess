# Chess
A chess application developed using Elixir/Phoenix/OTP (backend) and Svelte (frontend).   
Made by: [diderikk](https://github.com/diderikk)
Website: TODO
API-URL: [https://elixirapi.me:4002/](https://elixirapi.me:4002/)

## Content
1. [Introduction](#introduction)
2. [Functionality](#functionality)
3. [Deployment](#deployment)
4. [Installation Manual](#installation-manual)

## Introduction
This hobby project was developed during the summer 2022 concurrently with a summer intership. The main objective was to experiment with [Elixir/OTP](https://elixir-lang.org/getting-started/mix-otp/genserver.html).
As a result I developed a full stack application using Elixir/Phoenix (API framework) and Svelte (UI framework). 
The backend consists of a pure websocket interface (no HTTP endpoints, only WS endpoints) and no database.
This means all data is stored in memory using Elixir/OTP. 
Elixir/OTP are independent processes with memory that can communicate with the application.    
Svelte was selected as the UI framework because of its reputation of being lightweight, simple, has Typescript support and was a technology that I wanted to review.    
NB! Did not bother to add chess functionality backend, because this was too cumbersome on the frontend. As a consequence, moves are not being validated by a centralized authority. This can allow users to alter the state or result of the game to their benefit. This was one of the reasons for not implementing a user-rating system.   
Additionally, I have allowed users to connect multiple instances per IP-address to allow for testing.

## Functionality

### Lobby
* Join


## Deployment

### API
Hosted on a Vultr VM (the same as [ChatApp](https://github.com/diderikk/SimpleChatApp)). The domain is hosted free on Namecheap because of the Github Student Developer Pack. TLS Certificate was retrieved from Let's Encrypt.