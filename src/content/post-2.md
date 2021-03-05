---
title: "Redis PubSub"
date: "2021-03-05"
draft: false
path: "/blog/introduce-redis-pubsub"
---

## Summary

In this post I will introduce to you about Redis PubSub.

## Pubsub Architecture
![redis pubsub architecture](../images/redis-pubsub-architecture.png)

The above image is Redis Pubsub Architecture. We have Sender and Receiver are client which connect to Redis Server. Receiver will subcribe one Topic. Sender publish message to Topic, Receiver will receive this message.

## Example

You can check Redis Pubsub by open 2 client connect to Redis and follow command bellow

Start subcribe topic follow syntax bellow

```
> SUBSCRIBE ${TOPIC_NAME}
```

START send message to topic follow syntax bellow

```
> PUBLISH ${TOPIC_NAME} ${MESSAGE}
```

The results:

![redis-start-subcribe-topic](../images/redis-start-subscribe-topic-c1.png)

![redis-start-start-publist-to-topic](../images/redis-start-publish-topic-c1.png)

![redis-subcriber-receive-message-from-topic](../images/redis-subcriber-receive-message-from-topic-c1.png)

## Practical

When you want to scale up realtime application, you can use pubsub architecture.

This image bellow is sample chat application architecture.  

![scale-up-realtime-application](../images/pubsub-practical.png)
