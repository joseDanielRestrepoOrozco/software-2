const validateSchema = schema => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      const formatted = error.issues.reduce((acc, err) => {
        acc[err.path] = [...(acc[err.path] || []), err.message]
        return acc
      }, {})
      res.status(400).json({ errors: formatted })
    }
  }
}

export default validateSchema
