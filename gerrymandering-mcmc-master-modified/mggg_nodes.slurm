#!/usr/bin/env bash

#SBATCH --job-name=mothballs_gerrymandering
#SBATCH --output=test.log
#SBATCH --ntasks-per-node=28
#SBATCH --nodes=12
#SBATCH --time=03:59:59
#SBATCH -p short-28core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=kevin.chao@stonybrook.edu

module load anaconda/3
module load mpi4py/3.0.3

cd files

conda create -n gerry python=3.6 anaconda
source activate gerry

pip install -r requirements.txt
pip install mpi4py
mkdir output

# -np 336 -c 5000 -r 100
mpirun -np 1 python cli.py -g ./src/data/utahGerrymandering.json -c 0 -r 1
python BoxWhiskerGenerator.py
conda deactivate

