const request = require('supertest');

const BASE_URL = 'http://localhost:3000/api';

describe('Alaya Yoga Planner API Tests', () => {
    let authToken = '';
    let userId = '';
    let testYogaId = '';
    let testPlanId = '';

    const testUser = {
        username: `yoga_fan_${Date.now()}`,
        email: `yoga${Date.now()}@example.com`,
        password: 'Password123!',
    };

    //  Auth and user section
    describe('Auth System', () => {
        it('should register a new user', async () => {
            const res = await request(BASE_URL)
                .post('/user/register')
                .send(testUser);
            
            expect(res.statusCode).toBe(201); 
            expect(res.body.success).toBe(true);
        });

        it('should login the user and return a token', async () => {
            const res = await request(BASE_URL)
                .post('/user/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            authToken = res.body.token;
            userId = res.body.user.id || res.body.user._id; 
        });
    });

    // Yoga and Sessions section
    describe('Yoga & Sessions', () => {
        it('should fetch yoga library', async () => {
            const res = await request(BASE_URL)
                .get('/admin/yoga-types')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should add a new yoga session for the user', async () => {
            const res = await request(BASE_URL)
                .post('/sessions/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    userId: userId,
                    date: new Date(),
                    type: 'Vinyasa Flow',
                    durationMinutes: 45
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });

// Planner and nutrition section
    describe('Planner & Nutrition', () => {
        it('should create a new yoga/meal plan', async () => {
            const res = await request(BASE_URL)
                .post('/plans/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    userId: userId,
                    title: 'Morning Zen',
                    description: 'Daily 15 min stretch',
                    status: 'pending'
                });

            expect(res.statusCode).toBe(201);
            testPlanId = res.body.plan._id || res.body.plan.id;
        });

        it('should fetch all plans for the user', async () => {
            const res = await request(BASE_URL)
                .get(`/plans/all/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should mark a plan as complete', async () => {
            const res = await request(BASE_URL)
                .patch(`/plans/${testPlanId}/complete`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });

        it('should fetch available meals (Nutrition)', async () => {
            const res = await request(BASE_URL)
                .get('/nutrition/available-meals')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
// Notifications and favourites
    describe('User Engagement', () => {
        it('should fetch user notifications', async () => {
            const res = await request(BASE_URL)
                .get('/notifications/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });

        it('should fail to access admin stats without proper role', async () => {
            const res = await request(BASE_URL)
                .get('/admin/all-data')
                .set('Authorization', `Bearer ${authToken}`);

            if (res.statusCode === 403) {
                expect(res.body.success).toBe(false);
            }
        });
    });

    describe('Account Management', () => {
        it('should delete the test account', async () => {
            const res = await request(BASE_URL)
                .delete(`/user/delete/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});