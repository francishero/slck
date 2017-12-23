const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
  if (!context.user || !context.user.id) {
    throw new Error('Not authenticated');
  }
});

// here we dont use createResolver higher order component first
// we first check if user is authenticated then we check if they are admin 

// export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
//   if (!context.user.isAdmin) {
//     throw new Error('Requires admin access');
//   }
// });

