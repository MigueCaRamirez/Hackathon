"""
Script de limpieza para dataset de viajes de taxi (NYC TLC Trip Data)
Optimizado para archivos grandes (2GB+) - Procesa en chunks

Atributos del dataset:
VendorID, tpep_pickup_datetime, tpep_dropoff_datetime, passenger_count,
trip_distance, pickup_longitude, pickup_latitude, RateCodeID, store_and_fwd_flag,
dropoff_longitude, dropoff_latitude, payment_type, fare_amount, extra, mta_tax,
tip_amount, tolls_amount, improvement_surcharge, total_amount

Uso:
    python clean_taxi_data.py <ruta_archivo_entrada> <ruta_archivo_salida>
    
Ejemplo:
    python clean_taxi_data.py "C:/Users/usuario/data/taxi_data.csv" "C:/Users/usuario/data/taxi_data_limpio.csv"
"""

import pandas as pd
import numpy as np
import sys
import os
from datetime import datetime

# Configuracion de columnas
COLUMNAS_ESPERADAS = [
    'VendorID', 'tpep_pickup_datetime', 'tpep_dropoff_datetime', 'passenger_count',
    'trip_distance', 'pickup_longitude', 'pickup_latitude', 'RateCodeID',
    'store_and_fwd_flag', 'dropoff_longitude', 'dropoff_latitude', 'payment_type',
    'fare_amount', 'extra', 'mta_tax', 'tip_amount', 'tolls_amount',
    'improvement_surcharge', 'total_amount'
]

# Columnas de coordenadas (no usar notacion cientifica)
COLUMNAS_COORDENADAS = ['pickup_longitude', 'pickup_latitude', 'dropoff_longitude', 'dropoff_latitude']

# Columnas de fecha
COLUMNAS_FECHA = ['tpep_pickup_datetime', 'tpep_dropoff_datetime']

# Columnas enteras
COLUMNAS_ENTERAS = ['VendorID', 'passenger_count', 'RateCodeID', 'payment_type']

# Columnas decimales (float)
COLUMNAS_DECIMALES = [
    'trip_distance', 'pickup_longitude', 'pickup_latitude', 'dropoff_longitude',
    'dropoff_latitude', 'fare_amount', 'extra', 'mta_tax', 'tip_amount',
    'tolls_amount', 'improvement_surcharge', 'total_amount'
]

# Tamano del chunk para procesamiento (ajustar segun RAM disponible)
CHUNK_SIZE = 100000  # 100,000 filas por chunk


def validar_y_convertir_entero(valor):
    """Valida y convierte un valor a entero, retorna None si no es valido."""
    if pd.isna(valor):
        return None
    try:
        # Verificar que no contenga letras
        str_val = str(valor).strip()
        if any(c.isalpha() for c in str_val):
            return None
        return int(float(valor))
    except (ValueError, TypeError):
        return None


def validar_y_convertir_decimal(valor):
    """Valida y convierte un valor a decimal, retorna None si no es valido."""
    if pd.isna(valor):
        return None
    try:
        # Verificar que no contenga letras (excepto 'e' o 'E' para notacion cientifica)
        str_val = str(valor).strip().lower()
        # Remover caracteres validos para numeros
        test_str = str_val.replace('.', '').replace('-', '').replace('+', '').replace('e', '')
        if any(c.isalpha() for c in test_str):
            return None
        return float(valor)
    except (ValueError, TypeError):
        return None


def validar_y_convertir_fecha(valor):
    """Valida y convierte un valor a datetime, retorna None si no es valido."""
    if pd.isna(valor):
        return None
    try:
        # Intentar parsear varios formatos comunes
        formatos = [
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d %H:%M:%S.%f',
            '%d/%m/%Y %H:%M:%S',
            '%d-%m-%Y %H:%M:%S',
            '%Y/%m/%d %H:%M:%S'
        ]
        for fmt in formatos:
            try:
                return datetime.strptime(str(valor).strip(), fmt)
            except ValueError:
                continue
        # Intentar con pandas como ultimo recurso
        return pd.to_datetime(valor)
    except (ValueError, TypeError):
        return None


def formatear_fecha(fecha):
    """Formatea una fecha a dia/mes/anio hora:minuto:segundo (24h)."""
    if pd.isna(fecha) or fecha is None:
        return None
    try:
        if isinstance(fecha, str):
            fecha = pd.to_datetime(fecha)
        return fecha.strftime('%d/%m/%Y %H:%M:%S')
    except:
        return None


def formatear_decimal(valor, decimales=2):
    """Formatea un decimal asegurando que tenga el 0 antes del punto si es menor a 1."""
    if pd.isna(valor) or valor is None:
        return None
    try:
        # Formato que garantiza el 0 antes del punto decimal
        return f"{float(valor):.{decimales}f}"
    except:
        return None


def formatear_coordenada(valor):
    """Formatea una coordenada sin notacion cientifica, con 6 decimales."""
    if pd.isna(valor) or valor is None:
        return None
    try:
        # Formato fijo con 6 decimales, sin notacion cientifica
        return f"{float(valor):.6f}"
    except:
        return None


def limpiar_chunk(df):
    """Limpia un chunk de datos aplicando todas las reglas de validacion."""
    
    registros_iniciales = len(df)
    
    # 1. Eliminar filas con cualquier valor nulo
    df = df.dropna()
    
    # 2. Validar y convertir columnas enteras
    for col in COLUMNAS_ENTERAS:
        if col in df.columns:
            df[col] = df[col].apply(validar_y_convertir_entero)
    
    # 3. Validar y convertir columnas decimales
    for col in COLUMNAS_DECIMALES:
        if col in df.columns:
            df[col] = df[col].apply(validar_y_convertir_decimal)
    
    # 4. Validar y convertir columnas de fecha
    for col in COLUMNAS_FECHA:
        if col in df.columns:
            df[col] = df[col].apply(validar_y_convertir_fecha)
    
    # 5. Eliminar filas que quedaron con valores nulos despues de la conversion
    df = df.dropna()
    
    # 6. Eliminar registros con trip_distance = 0
    if 'trip_distance' in df.columns:
        df = df[df['trip_distance'] != 0]
    
    # 7. Formatear fechas a dia/mes/anio con hora 24h
    for col in COLUMNAS_FECHA:
        if col in df.columns:
            df[col] = df[col].apply(formatear_fecha)
    
    # 8. Formatear coordenadas sin notacion cientifica
    for col in COLUMNAS_COORDENADAS:
        if col in df.columns:
            df[col] = df[col].apply(formatear_coordenada)
    
    # 9. Formatear decimales asegurando el 0 antes del punto
    # Para trip_distance usar 2 decimales
    if 'trip_distance' in df.columns:
        df['trip_distance'] = df['trip_distance'].apply(lambda x: formatear_decimal(x, 2))
    
    # Para montos usar 2 decimales
    columnas_montos = ['fare_amount', 'extra', 'mta_tax', 'tip_amount', 
                       'tolls_amount', 'improvement_surcharge', 'total_amount']
    for col in columnas_montos:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: formatear_decimal(x, 2))
    
    # 10. Eliminar cualquier fila que tenga valores nulos despues del formateo
    df = df.dropna()
    
    registros_finales = len(df)
    registros_eliminados = registros_iniciales - registros_finales
    
    return df, registros_eliminados


def procesar_archivo(archivo_entrada, archivo_salida):
    """Procesa el archivo CSV en chunks para manejar archivos grandes."""
    
    print(f"\n{'='*60}")
    print("LIMPIEZA DE DATASET DE VIAJES DE TAXI")
    print(f"{'='*60}\n")
    
    # Verificar que el archivo existe
    if not os.path.exists(archivo_entrada):
        print(f"ERROR: El archivo '{archivo_entrada}' no existe.")
        sys.exit(1)
    
    # Obtener tamano del archivo
    tamano_archivo = os.path.getsize(archivo_entrada) / (1024**3)  # En GB
    print(f"Archivo de entrada: {archivo_entrada}")
    print(f"Tamano del archivo: {tamano_archivo:.2f} GB")
    print(f"Procesando en chunks de {CHUNK_SIZE:,} registros...\n")
    
    total_registros_procesados = 0
    total_registros_validos = 0
    total_registros_eliminados = 0
    chunk_numero = 0
    es_primer_chunk = True
    
    try:
        # Leer y procesar en chunks
        for chunk in pd.read_csv(archivo_entrada, chunksize=CHUNK_SIZE, low_memory=False):
            chunk_numero += 1
            registros_en_chunk = len(chunk)
            
            print(f"Procesando chunk {chunk_numero} ({registros_en_chunk:,} registros)...", end=" ")
            
            # Limpiar el chunk
            chunk_limpio, eliminados = limpiar_chunk(chunk)
            
            registros_validos = len(chunk_limpio)
            total_registros_procesados += registros_en_chunk
            total_registros_validos += registros_validos
            total_registros_eliminados += eliminados
            
            # Escribir al archivo de salida
            if es_primer_chunk:
                chunk_limpio.to_csv(archivo_salida, index=False, mode='w')
                es_primer_chunk = False
            else:
                chunk_limpio.to_csv(archivo_salida, index=False, mode='a', header=False)
            
            print(f"OK ({registros_validos:,} validos, {eliminados:,} eliminados)")
        
        # Resumen final
        print(f"\n{'='*60}")
        print("RESUMEN DE LIMPIEZA")
        print(f"{'='*60}")
        print(f"Total de registros procesados: {total_registros_procesados:,}")
        print(f"Total de registros validos:    {total_registros_validos:,}")
        print(f"Total de registros eliminados: {total_registros_eliminados:,}")
        print(f"Porcentaje de datos conservados: {(total_registros_validos/total_registros_procesados*100):.2f}%")
        print(f"\nArchivo de salida: {archivo_salida}")
        
        # Tamano del archivo de salida
        if os.path.exists(archivo_salida):
            tamano_salida = os.path.getsize(archivo_salida) / (1024**3)
            print(f"Tamano del archivo de salida: {tamano_salida:.2f} GB")
        
        print(f"\nLimpieza completada exitosamente!")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"\nERROR durante el procesamiento: {str(e)}")
        sys.exit(1)


def main():
    """Funcion principal del script."""
    
    # Verificar argumentos
    if len(sys.argv) != 3:
        print("\nUso: python clean_taxi_data.py <archivo_entrada> <archivo_salida>")
        print("\nEjemplo:")
        print('  python clean_taxi_data.py "C:/datos/taxi.csv" "C:/datos/taxi_limpio.csv"')
        print("\nAtributos esperados en el CSV:")
        for col in COLUMNAS_ESPERADAS:
            print(f"  - {col}")
        sys.exit(1)
    
    archivo_entrada = sys.argv[1]
    archivo_salida = sys.argv[2]
    
    # Procesar el archivo
    procesar_archivo(archivo_entrada, archivo_salida)


if __name__ == "__main__":
    main()
