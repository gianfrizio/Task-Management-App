const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  describe('Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should fail without username', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    it('should fail without email', async () => {
      const user = new User({
        username: 'testuser',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should fail without password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should fail with username containing invalid characters', async () => {
      const user = new User({
        username: 'test user!', // Spaces and special chars not allowed
        email: 'test@example.com',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    it('should fail with username too short', async () => {
      const user = new User({
        username: 'ab', // Less than 3 chars
        email: 'test@example.com',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    it('should fail with username too long', async () => {
      const user = new User({
        username: 'a'.repeat(31), // More than 30 chars
        email: 'test@example.com',
        password: 'Password123',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    it('should fail with password too short', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Pass123', // Less than 8 chars
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      await new User(userData).save();

      const duplicateUser = new User({
        username: 'anotheruser',
        email: 'test@example.com', // Same email
        password: 'Password456',
      });

      let error;
      try {
        await duplicateUser.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });

    it('should fail with duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      await new User(userData).save();

      const duplicateUser = new User({
        username: 'testuser', // Same username
        email: 'another@example.com',
        password: 'Password456',
      });

      let error;
      try {
        await duplicateUser.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Password123';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt format
    });

    it('should not rehash password if not modified', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();
      const firstHash = user.password;

      user.username = 'updateduser';
      await user.save();

      expect(user.password).toBe(firstHash);
    });
  });

  describe('comparePassword Method', () => {
    it('should return true for correct password', async () => {
      const plainPassword = 'Password123';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();

      // Need to select password explicitly
      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword(plainPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword('WrongPassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Password Exclusion', () => {
    it('should exclude password from JSON by default', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();

      const json = user.toJSON();
      expect(json.password).toBeUndefined();
    });

    it('should exclude password from queries by default', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();

      const foundUser = await User.findById(user._id);
      expect(foundUser.password).toBeUndefined();
    });

    it('should include password when explicitly selected', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();

      const foundUser = await User.findById(user._id).select('+password');
      expect(foundUser.password).toBeDefined();
      expect(foundUser.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });

  describe('Email Normalization', () => {
    it('should convert email to lowercase', async () => {
      const user = new User({
        username: 'testuser',
        email: 'Test@Example.COM',
        password: 'Password123',
      });

      await user.save();

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      await user.save();
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      user.username = 'updateduser';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
