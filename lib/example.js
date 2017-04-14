exports.Example = function(usage, description) {
  if (typeof usage !== 'string' || typeof description !== 'string') {
    throw new TypeError(
      'Usage for adding an Example: args.example("usage", "description")'
    );
  }
  this.details.examples.push({ usage, description });

  return this;
};

exports.Examples = function(list) {
  if (list.constructor !== Array) {
    throw new Error('Item passed to .examples is not an array');
  }

  for (const item of list) {
    const usage = item.usage || false;
    const description = item.description || false;
    this.example(usage, description);
  }

  return this;
};
