import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRE = "1h";
process.env.CLIENT_URL = "http://localhost:3000";
process.env.EMAIL_HOST = "smtp.test.dev";
process.env.EMAIL_PORT = "587";
process.env.EMAIL_USER = "test@example.com";
process.env.EMAIL_PASSWORD = "test-password";
process.env.EMAIL_FROM = "Test <test@example.com>";

vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn().mockResolvedValue({ messageId: "mock-message-id" }),
      })),
    },
  };
});

vi.mock("cloudinary", () => {
  const uploadStream = vi.fn((options, callback) => {
    return {
      end: () =>
        callback(null, {
          secure_url: "https://mock.cloudinary.test/image.jpg",
          public_id: "mock-public-id",
        }),
    };
  });

  return {
    v2: {
      config: vi.fn(),
      uploader: {
        upload_stream: uploadStream,
        destroy: vi.fn().mockResolvedValue({ result: "ok" }),
      },
    },
  };
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});
