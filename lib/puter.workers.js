const PROJECT_PREFIX = 'roomify_project_';

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};

const getUserId = async (puterUser) => {
  try {
    const user = await puterUser.auth.getUser();
    return user?.uuid || null;
  } catch {
    return null;
  }
};

router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
});

router.post('/api/projects/save', async ({ request, user }) => {
  try {
    const puterUser = user.puter;
    if (!puterUser) return jsonResponse({ error: 'Authentication failed' }, 401);

    const body = await request.json();
    const project = body?.project;

    if (!project?.id || !project?.sourceImage) {
        return jsonResponse({ error: 'Project not found' }, 400);
    }

    const payload = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    const userId = await getUserId(puterUser);
    if (!userId) return jsonResponse({ error: 'Authentication failed' }, 401);

    const key = `${PROJECT_PREFIX}${project.id}`;
    await puterUser.kv.set(key, payload);

    return jsonResponse({ saved: true, id: project.id, project: payload });
  } catch (error) {
    return jsonResponse({ error: 'Failed to save project', message: error.message }, 500);
  }
});

router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonResponse({ error: 'Authentication failed' }, 401);

        const userId = await getUserId(userPuter);
        if (!userId) return jsonResponse({ error: 'Authentication failed' }, 401);

        const projects = (await userPuter.kv.list(PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: true }));

        return jsonResponse({ projects });
    } catch (e) {
        return jsonResponse({ error: 'Failed to list projects', message: e.message }, 500);
    }
});

router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonResponse({ error: 'Authentication failed' }, 401);

        const userId = await getUserId(userPuter);
        if (!userId) return jsonResponse({ error: 'Authentication failed' }, 401);

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonResponse({ error: 'Project ID is required' }, 400);

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);

        if (!project) return jsonResponse({ error: 'Project not found' }, 404);

        return jsonResponse({ project });
    } catch (e) {
        return jsonResponse({ error: 'Failed to get project', message: e.message }, 500);
    }
});