// src/controllers/postControllers.ts
import { Request, Response } from "express";
import pool from "../database/db";
import { Post } from "../models/post.model";

const postController = {
  getPosts: async (req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT * FROM post");
      const posts: Post[] = result.rows;

      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // ✅ Add new route: Create a post
  createPost: async (req: Request, res: Response) => {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    try {
      const result = await pool.query(
        "INSERT INTO post (title, description) VALUES ($1, $2) RETURNING *",
        [title, description]
      );

      const newPost: Post = result.rows[0];
      res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to create post",
      });
    }
  }
};

export default postController;
