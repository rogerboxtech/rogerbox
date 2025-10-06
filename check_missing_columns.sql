-- Verificar si la tabla courses tiene la estructura completa esperada
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'short_description') THEN 'EXISTE' ELSE 'FALTA' END as short_description,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'description') THEN 'EXISTE' ELSE 'FALTA' END as description,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'preview_image') THEN 'EXISTE' ELSE 'FALTA' END as preview_image,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'category') THEN 'EXISTE' ELSE 'FALTA' END as category,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration_days') THEN 'EXISTE' ELSE 'FALTA' END as duration_days,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'calories_burned') THEN 'EXISTE' ELSE 'FALTA' END as calories_burned,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'level') THEN 'EXISTE' ELSE 'FALTA' END as level,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_published') THEN 'EXISTE' ELSE 'FALTA' END as is_published;
