<?php

namespace App\Events;

use App\Models\Article;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ArticleSold implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $articleId;
    public Article $article;

    /**
     * Create a new event instance.
     * @throws \Exception
     */
    public function __construct(int $articleId)
    {
        $article = Article::find($articleId);

        if ($article === null) {
            throw new \Exception('Article not found');
        }

        $this->article = $article;
        $this->articleId = $articleId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // These channels should be private, but I couldn't figure out authentication
            new Channel('user.' . $this->article->ab_creator_id),
            new Channel('article.' . $this->articleId),
            new Channel('articles'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'article-sold';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return ['article' => $this->article];
    }
}
